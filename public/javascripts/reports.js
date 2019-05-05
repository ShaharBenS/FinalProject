function generateSummary(processName) {
    window.location.href = 'reportProcess/?process_name=' + processName;
}

function generateSummary2(processName) {
    let url = '../reportProcess/?process_name=' + processName;
    let win = window.open(url, '_blank');
    win.focus();
}