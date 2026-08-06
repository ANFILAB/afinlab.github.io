/* ==========================================================================
   SESIONES LEARNING LAB — Lógica de datos y gráficos (Chart.js)
   ========================================================================== */

let financialsData = null;
let chartRoaRoe = null;
let chartMargenDp = null;

const COMPANY_LABELS = {
    'Laredo': 'Sol de Laredo',
    'Cartavio': 'Cartavio',
    'Paramonga': 'Paramonga',
    'Casa Grande': 'Casa Grande',
    'San Jacinto': 'San Jacinto'
};

const CHART_COLORS = {
    roa: '#7ec98f',
    roe: '#1f6e43',
    margen: '#1f6e43',
    dp: '#e0a500'
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('financials.json')
        .then(res => res.json())
        .then(data => {
            financialsData = data;
            renderCompany('Laredo');
            setupTabs();
        })
        .catch(err => {
            console.error('No se pudo cargar financials.json', err);
            const box = document.getElementById('interpretation-text');
            if (box) box.textContent = 'No se pudieron cargar los datos financieros. Verifica que financials.json esté en la misma carpeta.';
        });
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const company = tab.dataset.company;
            if (company === 'Benchmarking') {
                renderBenchmarking();
            } else {
                renderCompany(company);
            }
        });
    });
}

/* ── Vista de una empresa individual ── */
function renderCompany(companyKey) {
    const data = financialsData[companyKey];
    if (!data) return;

    const label = COMPANY_LABELS[companyKey] || companyKey;
    document.getElementById('breadcrumb-empresa').textContent = label;
    document.getElementById('analisis-empresa').textContent = label;

    // KPIs
    const s = data.summary;
    document.getElementById('kpi-ingresos').textContent = formatSoles(s.ingresos_prom);
    document.getElementById('kpi-roe').textContent = s.roe_prom !== null ? s.roe_prom + '%' : '—';
    document.getElementById('kpi-dp').textContent = s.dp_ratio !== null ? s.dp_ratio : '—';
    document.getElementById('kpi-volatilidad').textContent = s.volatilidad_roe !== null ? s.volatilidad_roe + '%' : '—';

    // Datos por año para los gráficos
    const years = s.valid_years;
    const roa = years.map(y => data.years[y].roa);
    const roe = years.map(y => data.years[y].roe);
    const margen = years.map(y => data.years[y].margen_neto);
    const dp = years.map(y => data.years[y].dp);

    drawLineChart('chart-roa-roe', years, [
        { label: 'ROA %', data: roa, color: CHART_COLORS.roa },
        { label: 'ROE %', data: roe, color: CHART_COLORS.roe }
    ]);

    drawLineChart('chart-margen-dp', years, [
        { label: 'Margen Neto %', data: margen, color: CHART_COLORS.margen },
        { label: 'D/P', data: dp, color: CHART_COLORS.dp }
    ]);

    document.querySelectorAll('.chart-title')[0].textContent = 'Distribución de rentabilidad (ROA/ROE)';
    document.querySelectorAll('.chart-title')[1].textContent = 'Tendencia de márgenes';

    document.getElementById('interpretation-text').textContent = buildInterpretation(label, s);
}

/* ── Vista de Benchmarking (compara las 5 empresas) ── */
function renderBenchmarking() {
    document.getElementById('breadcrumb-empresa').textContent = 'Benchmarking';
    document.getElementById('analisis-empresa').textContent = 'Benchmarking sectorial';

    const companies = Object.keys(financialsData);
    const roeVals = companies.map(c => financialsData[c].summary.roe_prom);
    const dpVals = companies.map(c => financialsData[c].summary.dp_ratio);
    const ingresosVals = companies.map(c => financialsData[c].summary.ingresos_prom);
    const volVals = companies.map(c => financialsData[c].summary.volatilidad_roe);

    const avgIngresos = average(ingresosVals);
    const avgRoe = average(roeVals);
    const avgDp = average(dpVals);
    const avgVol = average(volVals);

    document.getElementById('kpi-ingresos').textContent = formatSoles(avgIngresos);
    document.getElementById('kpi-roe').textContent = round2(avgRoe) + '%';
    document.getElementById('kpi-dp').textContent = round2(avgDp);
    document.getElementById('kpi-volatilidad').textContent = round2(avgVol) + '%';

    const labels = companies.map(c => COMPANY_LABELS[c] || c);

    drawBarChart('chart-roa-roe', labels, [
        { label: 'ROE Promedio %', data: roeVals, color: CHART_COLORS.roe }
    ]);

    drawBarChart('chart-margen-dp', labels, [
        { label: 'D/P Ratio', data: dpVals, color: CHART_COLORS.dp }
    ]);

    document.querySelectorAll('.chart-title')[0].textContent = 'ROE Promedio por empresa';
    document.querySelectorAll('.chart-title')[1].textContent = 'D/P Ratio por empresa';

    const mejor = companies[roeVals.indexOf(Math.max(...roeVals))];
    const masEstable = companies[volVals.indexOf(Math.min(...volVals))];

    document.getElementById('interpretation-text').textContent =
        `Comparando las 5 empresas del sector, ${COMPANY_LABELS[mejor]} presenta el mayor ROE promedio ` +
        `(${round2(financialsData[mejor].summary.roe_prom)}%), mientras que ${COMPANY_LABELS[masEstable]} muestra ` +
        `la mayor estabilidad, con una volatilidad de ROE de solo ${round2(financialsData[masEstable].summary.volatilidad_roe)}%.`;
}

/* ── Utilidades de gráficos ── */
function drawLineChart(canvasId, years, series) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (canvasId === 'chart-roa-roe' && chartRoaRoe) chartRoaRoe.destroy();
    if (canvasId === 'chart-margen-dp' && chartMargenDp) chartMargenDp.destroy();

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: series.map(s => ({
                label: s.label,
                data: s.data,
                borderColor: s.color,
                backgroundColor: s.color,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: s.color,
                borderWidth: 2
            }))
        },
        options: chartOptions()
    });

    if (canvasId === 'chart-roa-roe') chartRoaRoe = chart;
    if (canvasId === 'chart-margen-dp') chartMargenDp = chart;
}

function drawBarChart(canvasId, labels, series) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (canvasId === 'chart-roa-roe' && chartRoaRoe) chartRoaRoe.destroy();
    if (canvasId === 'chart-margen-dp' && chartMargenDp) chartMargenDp.destroy();

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: series.map(s => ({
                label: s.label,
                data: s.data,
                backgroundColor: s.color,
                borderRadius: 6
            }))
        },
        options: chartOptions()
    });

    if (canvasId === 'chart-roa-roe') chartRoaRoe = chart;
    if (canvasId === 'chart-margen-dp') chartMargenDp = chart;
}

function chartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, font: { size: 11 } }
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(22,40,63,0.06)' } },
            x: { grid: { display: false } }
        }
    };
}

/* ── Interpretación dinámica ── */
function buildInterpretation(label, s) {
    const volTxt = s.volatilidad_roe < 5 ? 'baja' : (s.volatilidad_roe < 10 ? 'moderada' : 'alta');
    const consistencia = s.volatilidad_roe < 5 ? 'consistencia' : (s.volatilidad_roe < 10 ? 'cierta variabilidad' : 'inconsistencia');
    const apalancamiento = s.dp_ratio < 0.7 ? 'bajo' : (s.dp_ratio < 1.2 ? 'moderado' : 'alto');

    return `${label} muestra una rentabilidad con un ROE promedio de ${round2(s.roe_prom)}% y ${volTxt} volatilidad ` +
           `(${round2(s.volatilidad_roe)}%), indicando ${consistencia} operativa. La relación Deuda/Patrimonio de ` +
           `${round2(s.dp_ratio)} sugiere un nivel de apalancamiento ${apalancamiento}.`;
}

/* ── Helpers ── */
function formatSoles(value) {
    if (value === null || value === undefined) return '—';
    return 'S/. ' + (value / 1000).toFixed(0) + 'M';
}

function average(arr) {
    const valid = arr.filter(v => v !== null && v !== undefined);
    return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function round2(n) {
    return Math.round(n * 100) / 100;
}
