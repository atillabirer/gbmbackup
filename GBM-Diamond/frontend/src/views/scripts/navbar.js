let deploymentStep = localStorage.getItem('currentDeploymentStep')

if (deploymentStep > 13) {
    flipVisibility();
}

function flipVisibility() {
    let elements = document.getElementsByClassName('deployment-required');
    for (let i = 0; i < elements.length; i++) {
        elements[i].hidden = false;
    }

    let elements2 = document.getElementsByClassName('pre-deployment');
    for (let i = 0; i < elements2.length; i++) {
        elements2[i].hidden = true;
    }
}