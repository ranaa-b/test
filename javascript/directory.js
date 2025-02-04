const directoryStructure = {
    "Graph Arena": {
        "isomorphism": {
            "easy": {
                "inputs": {
                    "train (140,000 samples)": null,
                    "test (15,718 samples)": null
                },
                "labels": {
                    "train_labels.txt": null,
                    "test_labels.txt": null
                }
            },
            "hard": {
                "inputs": {
                    "train (127,374 samples)": null,
                    "test (14,298 samples)": null
                },
                "labels": {
                    "train_labels.txt": null,
                    "test_labels.txt": null
                }
            }
        },
        "path": {
            "hamiltonian": {
                "inputs": {
                    "train (25,000 samples)": null,
                    "test": {
                        "kawai (2,480 samples)": null,
                        "planar (2,480 samples)": null
                    }
                },
                "labels": {
                    "train_labels.txt": null,
                    "test_labels.txt": null
                }
            },
            "shortest": {
                "inputs": {
                    "train (80,000 samples)": null,
                    "test": {
                        "random (8,672 samples)": null,
                        "kawai (8,672 samples)": null,
                        "planar (8,672 samples)": null
                    }
                },
                "labels": {
                    "train_labels.txt": null,
                    "test_labels.txt": null
                }
            }
        },
        "cycle": {
            "hamiltonian": {
                "inputs": {
                    "train (69,935 samples)": null,
                    "test": {
                        "kawai (7,740 samples)": null,
                        "planar (7,740 samples)": null
                    }
                },
                "labels": {
                    "train_labels.txt": null,
                    "test_labels.txt": null
                }
            },
            "cordless": {
                "inputs": {
                    "train (80,000 samples)": null,
                    "test": {
                        "kawai (6,484 samples)": null,
                        "planar (6,484 samples)": null
                    }
                },
                "labels": {
                    "train_labels.txt": null,
                    "test_labels.txt": null
                }
            }
        }
    }
};

const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const fileIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;

function createTree(obj, path = []) {
    const ul = document.createElement('ul');

    for (let key in obj) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const isFolder = obj[key] !== null;
        span.innerHTML = (isFolder ? folderIcon : fileIcon) + key;
        span.className = isFolder ? 'folder' : 'file';

        const currentPath = [...path, key];
        span.setAttribute('data-path', JSON.stringify(currentPath));

        if (isFolder) {
            const itemCount = Object.keys(obj[key]).length;
            const countSpan = document.createElement('span');
            countSpan.className = 'item-count';
            countSpan.textContent = `(${itemCount})`;
            span.appendChild(countSpan);

            span.addEventListener('click', toggleFolder);
            li.appendChild(span);
            li.appendChild(createTree(obj[key], currentPath));
        } else {
            li.appendChild(span);
        }

        ul.appendChild(li);
    }

    return ul;
}

function toggleFolder(e) {
    const li = this.parentElement;
    li.classList.toggle('expanded');
    updateBreadcrumb(JSON.parse(this.getAttribute('data-path')));
    e.stopPropagation();
}

function updateBreadcrumb(path) {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';
    path.forEach((item, index) => {
        const span = document.createElement('span');
        span.textContent = item;
        span.addEventListener('click', () => navigateTo(path.slice(0, index + 1)));
        breadcrumb.appendChild(span);
    });
}

function navigateTo(path) {
    const allFolders = document.querySelectorAll('.folder');
    allFolders.forEach(folder => {
        const folderPath = JSON.parse(folder.getAttribute('data-path'));
        if (path.every((item, index) => folderPath[index] === item)) {
            folder.parentElement.classList.add('expanded');
        } else {
            folder.parentElement.classList.remove('expanded');
        }
    });
    updateBreadcrumb(path);
}

function expandAll() {
    document.querySelectorAll('.directory li').forEach(li => li.classList.add('expanded'));
}

function collapseAll() {
    document.querySelectorAll('.directory li').forEach(li => li.classList.remove('expanded'));
    document.querySelector('.directory > div > ul > li').classList.add('expanded');
    updateBreadcrumb(['Graph Arena']);
}

document.getElementById('tree').appendChild(createTree(directoryStructure));
document.getElementById('expandAll').addEventListener('click', expandAll);
document.getElementById('collapseAll').addEventListener('click', collapseAll);

// Initialize with root expanded
document.querySelector('.directory > div > ul > li').classList.add('expanded');
updateBreadcrumb(['Graph Arena']);
