// Fonction pour récupérer la liste des images depuis le serveur
async function fetchImages(subdir) {
    try {
        const response = await fetch(`get_images.php?subdir=${subdir}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }
        const images = await response.json();
        return images;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fonction pour afficher le contenu d'un arbuste spécifique
async function loadArbusteContent(selectedId) {
    const contentDiv = document.getElementById('arbustes-content');
    contentDiv.innerHTML = ''; // Efface le contenu précédent

    const arbuste = arbustesData.find(a => a.id === selectedId); // Trouve l'arbuste sélectionné

    if (arbuste) {
        const images = await fetchImages(arbuste.id);
        arbuste.images = images; // Mettre à jour la liste des images de l'arbuste

        const arbusteContainer = document.createElement('div');
        arbusteContainer.classList.add('arbuste-container');
        arbusteContainer.id = arbuste.id;

        arbusteContainer.innerHTML = `
            <div class="image-buttons">
                <h2>${arbuste.name}</h2>
                <div class="gallery">
                    <img id="image-${arbuste.id}" src="${arbuste.images[0]}" alt="${arbuste.name}">
                </div>
                <div class="button-container">
                    <button id="prev-button-${arbuste.id}">Précédent</button>
                    <button id="next-button-${arbuste.id}">Suivant</button>
                </div>
            </div>
            <div class="description">${arbuste.description}</div>
        `;

        contentDiv.appendChild(arbusteContainer);

        // Ajout d'écouteurs d'événements pour les boutons
        document.getElementById(`prev-button-${arbuste.id}`).addEventListener('click', () => {
            changeImage(arbuste.id, -1);
        });

        document.getElementById(`next-button-${arbuste.id}`).addEventListener('click', () => {
            changeImage(arbuste.id, 1);
        });
    }
}

// Fonction pour changer l'arbuste affiché
function selectArbuste(arbusteId) {
    loadArbusteContent(arbusteId);
}

// Fonction pour changer l'image affichée
function changeImage(arbusteId, direction) {
    const arbuste = arbustesData.find(a => a.id === arbusteId);
    const images = arbuste.images;
    const imageElement = document.getElementById(`image-${arbuste.id}`);
    let currentIndex = images.indexOf(imageElement.src.split('/').pop());

    // Mettre à jour l'index de l'image actuelle
    currentIndex = (currentIndex + direction + images.length) % images.length;

    // Mettre à jour l'image affichée
    imageElement.src = images[currentIndex];
}

// Appeler la fonction pour charger le contenu de l'arbuste par défaut lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    selectArbuste('noisetier'); // Changez 'noisetier' par l'ID de l'arbuste à afficher par défaut

    // Ajout d'écouteurs d'événements pour les liens de navigation
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Évite le comportement de défilement par défaut
            const arbusteId = link.getAttribute('data-arbuste'); // Récupère l'ID de l'arbuste à partir du lien
            selectArbuste(arbusteId);
        });
    });
});
