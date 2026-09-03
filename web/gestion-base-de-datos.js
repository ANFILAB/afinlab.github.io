/* ==========================================================================
   GESTIÓN DE BASE DE DATOS — Lógica de pestañas y visualización
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.empresa-panel');
    const breadcrumbEmpresa = document.getElementById('breadcrumb-empresa');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Set active tab
            tab.classList.add('active');

            // Set active panel
            const company = tab.dataset.company;
            const targetPanel = document.getElementById(`panel-${company}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Update breadcrumb text
            if (breadcrumbEmpresa) {
                breadcrumbEmpresa.textContent = tab.textContent;
            }
        });
    });
});
