
const moduleName = document.getElementById('moduleName');
const addButton = document.getElementById('addButton');
const moduleList = document.getElementById('module-list');
const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]'
);

// Récupérer les modules sauvegardés
let modules = JSON.parse(
    localStorage.getItem('modules')
) || [];

// Sauvegarder les modules
function saveModules() {
    localStorage.setItem('modules', JSON.stringify(modules));
}

function displayStats() {

    // Nombre total de modules
    document.getElementById('total-modules').textContent =
        modules.length;

    let totalAbsences = 0;
    let totalLimits = 0;

    modules.forEach(function (module) {

        module.types.forEach(function (type) {

            const count = type.absences.filter(Boolean).length;

            totalAbsences += count;

            if (count === 4) {
                totalLimits++;
            }

        });

    });

    // Afficher le nombre total d'absences
    document.getElementById('total-absences').textContent =
        totalAbsences;

    // Afficher le nombre de types ayant atteint 4 absences
    document.getElementById('total-limits').textContent =
        totalLimits;
}

// Afficher les modules
function displayModules() {
    moduleList.innerHTML = '';

    modules.forEach(function (module, moduleIndex) {
        const moduleItem = document.createElement('div');
        moduleItem.classList.add('module-card');

        const title = document.createElement('h3');
        title.textContent = module.name;
        moduleItem.appendChild(title);

        const deleteButton = document.createElement('button');

        deleteButton.textContent = 'Supprimer';
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', function () {
            const confirmation = confirm(
                'Voulez-vous supprimer ' + module.name + ' ?'
            );

            if (confirmation) {
                modules.splice(moduleIndex, 1);
                saveModules();
                displayModules();
            }
        });

        moduleItem.appendChild(deleteButton);


        module.types.forEach(function (type, typeIndex) {
            const typeTitle = document.createElement('h4');
            typeTitle.textContent = type.name + ' - Absences';

            const count = type.absences.filter(Boolean).length;

            const counter = document.createElement('span');
            counter.classList.add('absence-counter');
            counter.textContent = count + ' / 4';

            if (count === 4) {
                counter.classList.add('limit-reached');
            }

            typeTitle.appendChild(counter);

            moduleItem.appendChild(typeTitle);

            const boxes = document.createElement('div');
            boxes.classList.add('absence-boxes');

            type.absences.forEach(function (isAbsent, absenceIndex) {
                const box = document.createElement('div');

                box.textContent = 'Absence ' + (absenceIndex + 1);
                box.classList.add('absence-box');

                if (isAbsent) {
                    box.classList.add('marked');
                }

                box.addEventListener('click', function () {
                    type.absences[absenceIndex] = !type.absences[absenceIndex];

                    saveModules();
                    displayModules();

                    const total = type.absences.filter(Boolean).length;

                    if (type.absences[absenceIndex] && total === 4) {
                        alert(
                            'Attention ! 4 absences en ' + type.name +
                            ' pour ' + module.name
                        );
                    }
                });

                boxes.appendChild(box);
            });

            moduleItem.appendChild(boxes);
        });

        moduleList.appendChild(moduleItem);
    });
    displayStats();
}

// Ajouter un module
addButton.addEventListener('click', function () {
    const name = moduleName.value.trim();

    if (name === '') {
        alert('Entrez le nom du module !');
        return;
    }

    const selectedTypes = [];

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedTypes.push({
                name: checkbox.nextElementSibling.textContent,
                absences: [false, false, false, false]
            });
        }
    });

    if (selectedTypes.length === 0) {
        alert('Choisissez Cours, TD ou TP !');
        return;
    }

    modules.push({
        name: name,
        types: selectedTypes
    });

    saveModules();
    displayModules();

    moduleName.value = '';

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
});

// Afficher les données au chargement de la page
displayModules();
