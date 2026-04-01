// S.E.A. Archives - Main Application
// Interactive functionality and visualizations

class SEAArchives {
    constructor() {
        this.currentSection = 'home';
        this.currentFilter = {
            timeline: 'all',
            characters: 'all',
            locations: 'all',
            artifacts: 'all',
            family: 'hightower'
        };
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.initializeTimeline();
        this.initializeCharacters();
        this.initializeRelationships();
        this.initializeLocations();
        this.initializeFamilies();
        this.initializeArtifacts();
        this.setupArchiveCards();
        this.initDustParticles();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
        }, 2000);
    }

    // ==================== DUST PARTICLES ====================
    initDustParticles() {
        const canvas = document.getElementById('dustCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const count = 40;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.15 - 0.1,
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += 0.01;

                const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 102, ${currentOpacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==================== NAVIGATION ====================
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    navigateToSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });

        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupArchiveCards() {
        const archiveCards = document.querySelectorAll('.archive-card');
        archiveCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    // ==================== SEARCH ====================
    setupSearch() {
        const searchInput = document.getElementById('searchInput');

        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) return;

            const results = this.search(query);
            this.displaySearchResults(results, query);
        };

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    search(query) {
        const results = {
            characters: [],
            locations: [],
            artifacts: [],
            timeline: []
        };

        SEAData.characters.forEach(char => {
            if (char.name.toLowerCase().includes(query) ||
                char.description.toLowerCase().includes(query) ||
                char.occupation.toLowerCase().includes(query)) {
                results.characters.push(char);
            }
        });

        SEAData.locations.forEach(loc => {
            if (loc.name.toLowerCase().includes(query) ||
                loc.park.toLowerCase().includes(query) ||
                loc.description.toLowerCase().includes(query)) {
                results.locations.push(loc);
            }
        });

        SEAData.artifacts.forEach(art => {
            if (art.name.toLowerCase().includes(query) ||
                art.description.toLowerCase().includes(query) ||
                art.owner.toLowerCase().includes(query)) {
                results.artifacts.push(art);
            }
        });

        SEAData.timeline.forEach(event => {
            if (event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)) {
                results.timeline.push(event);
            }
        });

        return results;
    }

    displaySearchResults(results, query) {
        const total = results.characters.length + results.locations.length + results.artifacts.length + results.timeline.length;

        if (total === 0) {
            alert(`No results found for "${query}"`);
            return;
        }

        let msg = `Found ${total} result${total !== 1 ? 's' : ''} for "${query}":\n\n`;
        if (results.characters.length) msg += `Characters: ${results.characters.map(c => c.name).join(', ')}\n\n`;
        if (results.locations.length) msg += `Locations: ${results.locations.map(l => l.name).join(', ')}\n\n`;
        if (results.artifacts.length) msg += `Artifacts: ${results.artifacts.map(a => a.name).join(', ')}\n\n`;
        if (results.timeline.length) msg += `Timeline: ${results.timeline.map(e => e.title).join(', ')}\n`;

        alert(msg);
    }

    // ==================== TIMELINE ====================
    initializeTimeline() {
        this.renderTimeline();

        const filterBtns = document.querySelectorAll('.timeline-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter.timeline = btn.dataset.era;
                this.renderTimeline();
            });
        });
    }

    renderTimeline() {
        const container = document.getElementById('timelineViz');
        const filter = this.currentFilter.timeline;

        const filteredEvents = filter === 'all'
            ? SEAData.timeline
            : SEAData.timeline.filter(e => e.era === filter);

        container.innerHTML = filteredEvents.map((event, i) => `
            <div class="timeline-event" style="animation-delay: ${i * 0.08}s">
                <div class="event-date">${this.formatDate(event.date)}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
                <div class="event-location">${event.location}</div>
            </div>
        `).join('');
    }

    formatDate(dateStr) {
        if (dateStr.length === 4) return dateStr;
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                const months = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
                return `${months[parseInt(parts[1]) - 1]} ${parseInt(parts[2])}, ${parts[0]}`;
            }
            return parts[0];
        }
        return dateStr;
    }

    // ==================== CHARACTERS ====================
    initializeCharacters() {
        this.renderCharacters();

        const filterBtns = document.querySelectorAll('.character-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter.characters = btn.dataset.type;
                this.renderCharacters();
            });
        });

        const modal = document.getElementById('characterModal');
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    renderCharacters() {
        const container = document.getElementById('characterGrid');
        const filter = this.currentFilter.characters;

        const filteredChars = filter === 'all'
            ? SEAData.characters
            : SEAData.characters.filter(c => c.type === filter);

        container.innerHTML = filteredChars.map((char, i) => `
            <div class="character-card" data-id="${char.id}" data-type="${char.type}" onclick="seaArchives.showCharacterDetail('${char.id}')" style="animation: eventReveal 0.5s ${i * 0.05}s both">
                <div class="character-name">${char.name}</div>
                <div class="character-role">${char.occupation}</div>
                <div class="character-status">${char.status}</div>
            </div>
        `).join('');
    }

    showCharacterDetail(charId) {
        const char = SEAData.characters.find(c => c.id === charId);
        if (!char) return;

        const modal = document.getElementById('characterModal');
        const content = document.getElementById('characterDetailContent');

        const statusColor = char.type === 'antagonist' ? 'var(--burgundy-glow)' : 'var(--gold)';

        content.innerHTML = `
            <h2 style="font-family: var(--font-display); color: var(--gold); font-size: 1.8rem; margin-bottom: 0.25rem; letter-spacing: 2px;">
                ${char.name}
            </h2>
            <p style="font-family: var(--font-accent); font-style: italic; color: var(--ink-dim); margin-bottom: 1.5rem; font-size: 0.95rem;">${char.occupation}</p>

            <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <div>
                    <span style="font-family: var(--font-accent-sc); font-size: 0.7rem; color: var(--ink-dim); letter-spacing: 2px; text-transform: uppercase;">Status</span>
                    <div style="color: ${statusColor}; font-family: var(--font-body); font-weight: 600; margin-top: 0.15rem;">${char.status}</div>
                </div>
                <div>
                    <span style="font-family: var(--font-accent-sc); font-size: 0.7rem; color: var(--ink-dim); letter-spacing: 2px; text-transform: uppercase;">Membership</span>
                    <div style="color: var(--ink); font-family: var(--font-body); font-weight: 600; margin-top: 0.15rem;">${char.membership}</div>
                </div>
            </div>

            <p style="margin-bottom: 1.5rem; line-height: 1.7; color: var(--ink); font-family: var(--font-body);">${char.description}</p>

            ${char.connections.length > 0 ? `
                <div style="margin-bottom: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(201, 148, 62, 0.1);">
                    <h4 style="font-family: var(--font-accent-sc); font-size: 0.75rem; color: var(--gold-dark); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem;">Connections</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${char.connections.map(c => `<span style="padding: 2px 10px; border: 1px solid rgba(201, 148, 62, 0.15); color: var(--ink-dim); font-size: 0.85rem; border-radius: 1px; font-family: var(--font-accent);">${c}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${char.locations.length > 0 ? `
                <div style="margin-bottom: 1.25rem;">
                    <h4 style="font-family: var(--font-accent-sc); font-size: 0.75rem; color: var(--gold-dark); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem;">Featured Locations</h4>
                    <div style="color: var(--teal-glow); font-family: var(--font-accent); font-style: italic; font-size: 0.9rem;">
                        ${char.locations.join(' &bull; ')}
                    </div>
                </div>
            ` : ''}

            ${char.artifacts.length > 0 ? `
                <div>
                    <h4 style="font-family: var(--font-accent-sc); font-size: 0.75rem; color: var(--gold-dark); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem;">Associated Artifacts</h4>
                    <div style="color: var(--gold-light); font-family: var(--font-accent); font-style: italic; font-size: 0.9rem;">
                        ${char.artifacts.join(' &bull; ')}
                    </div>
                </div>
            ` : ''}
        `;

        modal.classList.add('active');
    }

    // ==================== RELATIONSHIPS ====================
    initializeRelationships() {
        this.relationshipMode = 'overview'; // 'overview' or 'focus'
        this.focusCharacterId = null;

        this.renderRelationships();

        const controls = ['showFamily', 'showFriendship', 'showRivalry', 'showProfessional'];
        controls.forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.renderRelationships();
            });
        });

        document.getElementById('relBackBtn').addEventListener('click', () => {
            this.showRelationshipOverview();
        });
    }

    getActiveRelationshipTypes() {
        const types = [];
        if (document.getElementById('showFamily').checked) types.push('family');
        if (document.getElementById('showFriendship').checked) types.push('friendship');
        if (document.getElementById('showRivalry').checked) types.push('rivalry');
        if (document.getElementById('showProfessional').checked) types.push('professional');
        return types;
    }

    getFilteredRelationships(characterId) {
        const activeTypes = this.getActiveRelationshipTypes();
        return SEAData.relationships.filter(r => {
            if (!activeTypes.includes(r.type)) return false;
            if (characterId) {
                return r.source === characterId || r.target === characterId;
            }
            return true;
        });
    }

    renderRelationships() {
        if (this.relationshipMode === 'focus' && this.focusCharacterId) {
            this.renderCharacterFocus(this.focusCharacterId);
        } else {
            this.renderOverview();
        }
    }

    renderOverview() {
        document.getElementById('relationshipBackNav').style.display = 'none';
        document.getElementById('focusCharacterHeader').style.display = 'none';

        const grid = document.getElementById('relationshipCards');
        const emptyMsg = document.getElementById('noRelationshipsMsg');
        const filtered = this.getFilteredRelationships();

        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        grid.innerHTML = filtered.map(rel => {
            const source = SEAData.characters.find(c => c.id === rel.source);
            const target = SEAData.characters.find(c => c.id === rel.target);
            const sourceName = source ? source.name : rel.source;
            const targetName = target ? target.name : rel.target;

            return `
                <div class="rel-card" data-rel-type="${rel.type}">
                    <div class="rel-card-people">
                        <button class="rel-card-person" data-character-id="${rel.source}">${sourceName}</button>
                        <span class="rel-card-connector">&amp;</span>
                        <button class="rel-card-person" data-character-id="${rel.target}">${targetName}</button>
                    </div>
                    <span class="rel-card-badge" data-type="${rel.type}">${this.formatRelType(rel.type)}</span>
                    <div class="rel-card-label">${rel.label}</div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.rel-card-person').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showCharacterFocus(btn.dataset.characterId);
            });
        });
    }

    showCharacterFocus(characterId) {
        this.relationshipMode = 'focus';
        this.focusCharacterId = characterId;
        this.renderRelationships();
    }

    renderCharacterFocus(characterId) {
        const char = SEAData.characters.find(c => c.id === characterId);
        if (!char) return;

        document.getElementById('relationshipBackNav').style.display = 'block';

        const header = document.getElementById('focusCharacterHeader');
        header.style.display = 'block';

        const connectionCount = SEAData.relationships.filter(
            r => r.source === characterId || r.target === characterId
        ).length;

        header.innerHTML = `
            <div class="rel-focus-name">${char.name}</div>
            <div class="rel-focus-occupation">${char.occupation}</div>
            <div class="rel-focus-meta">
                <span>Status: ${char.status}</span>
                <span>${char.membership}</span>
                <span>${connectionCount} connection${connectionCount !== 1 ? 's' : ''}</span>
            </div>
        `;

        const grid = document.getElementById('relationshipCards');
        const emptyMsg = document.getElementById('noRelationshipsMsg');
        const filtered = this.getFilteredRelationships(characterId);

        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';

        grid.innerHTML = filtered.map(rel => {
            const otherId = rel.source === characterId ? rel.target : rel.source;
            const other = SEAData.characters.find(c => c.id === otherId);
            const otherName = other ? other.name : otherId;

            return `
                <div class="rel-card" data-rel-type="${rel.type}">
                    <div class="rel-card-people">
                        <button class="rel-card-person" data-character-id="${otherId}">${otherName}</button>
                    </div>
                    <span class="rel-card-badge" data-type="${rel.type}">${this.formatRelType(rel.type)}</span>
                    <div class="rel-card-label">${rel.label}</div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.rel-card-person').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showCharacterFocus(btn.dataset.characterId);
            });
        });
    }

    showRelationshipOverview() {
        this.relationshipMode = 'overview';
        this.focusCharacterId = null;
        this.renderRelationships();
    }

    formatRelType(type) {
        const labels = {
            family: 'Family',
            friendship: 'Friendship',
            rivalry: 'Rivalry',
            professional: 'Professional'
        };
        return labels[type] || type;
    }

    // ==================== LOCATIONS ====================
    initializeLocations() {
        this.renderLocations();

        const filterBtns = document.querySelectorAll('.location-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter.locations = btn.dataset.region;
                this.renderLocations();
            });
        });
    }

    renderLocations() {
        const listContainer = document.getElementById('locationList');
        const mapContainer = document.getElementById('locationMap');
        const filter = this.currentFilter.locations;

        const filteredLocs = filter === 'all'
            ? SEAData.locations
            : SEAData.locations.filter(l => l.region === filter);

        listContainer.innerHTML = filteredLocs.map((loc, i) => `
            <div class="location-card" style="animation: eventReveal 0.5s ${i * 0.06}s both">
                <div class="location-name">${loc.name}</div>
                <div class="location-park">${loc.park} &mdash; ${loc.country}</div>
                <div class="location-description">${loc.description}</div>
                <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--ink-dim); font-family: var(--font-accent); font-style: italic;">
                    ${loc.type} &bull; Opened ${loc.opened}
                </div>
            </div>
        `).join('');

        // Region summary
        const regionCounts = {};
        filteredLocs.forEach(l => {
            regionCounts[l.region] = (regionCounts[l.region] || 0) + 1;
        });

        mapContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div style="font-family: var(--font-display); font-size: 1.2rem; color: var(--gold); margin-bottom: 0.5rem; letter-spacing: 2px; text-transform: uppercase;">
                    Global S.E.A. Presence
                </div>
                <div style="font-family: var(--font-accent); font-style: italic; color: var(--ink-dim); font-size: 1rem;">
                    ${filteredLocs.length} location${filteredLocs.length !== 1 ? 's' : ''} across ${Object.keys(regionCounts).length} region${Object.keys(regionCounts).length !== 1 ? 's' : ''}
                </div>
                <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap;">
                    ${Object.entries(regionCounts).map(([region, count]) => `
                        <div style="text-align: center;">
                            <div style="font-family: var(--font-display-decorative); font-size: 1.8rem; color: var(--gold); line-height: 1;">${count}</div>
                            <div style="font-family: var(--font-accent-sc); font-size: 0.7rem; color: var(--ink-dim); letter-spacing: 2px; text-transform: uppercase; margin-top: 0.25rem;">${region === 'sea' ? 'At Sea' : region === 'america' ? 'Americas' : region.charAt(0).toUpperCase() + region.slice(1)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ==================== FAMILIES ====================
    initializeFamilies() {
        this.renderFamilyTree();

        const familyBtns = document.querySelectorAll('.family-btn');
        familyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                familyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter.family = btn.dataset.family;
                this.renderFamilyTree();
            });
        });
    }

    renderFamilyTree() {
        const container = document.getElementById('familyTree');
        const familyKey = this.currentFilter.family;
        const family = SEAData.families[familyKey];

        if (!family) return;

        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--gold); margin-bottom: 0.5rem; letter-spacing: 3px; text-transform: uppercase;">
                    ${family.name}
                </h3>
                <div style="width: 40px; height: 1px; background: var(--gold-dark); margin: 0 auto 2rem; opacity: 0.5;"></div>
                <div style="display: flex; flex-direction: column; gap: 0; align-items: center;">
                    ${family.members.map((member, i) => `
                        ${i > 0 ? '<div class="family-connector"></div>' : ''}
                        <div class="family-member" style="animation: eventReveal 0.5s ${i * 0.15}s both">
                            <div class="family-member-name">${member.name}</div>
                            <div class="family-member-dates">${member.dates}</div>
                            <div style="font-size: 0.7rem; color: var(--ink-dim); margin-top: 0.25rem; font-family: var(--font-accent-sc); letter-spacing: 1px; text-transform: uppercase;">
                                ${this.getRelationLabel(member.relation)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getRelationLabel(relation) {
        const labels = {
            root: 'Patriarch',
            spouse: 'Spouse',
            child: 'Child',
            grandchild: 'Grandchild',
            sibling: 'Related',
            cousin: 'Cousin'
        };
        return labels[relation] || relation;
    }

    // ==================== ARTIFACTS ====================
    initializeArtifacts() {
        this.renderArtifacts();

        const filterBtns = document.querySelectorAll('.artifact-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter.artifacts = btn.dataset.type;
                this.renderArtifacts();
            });
        });
    }

    renderArtifacts() {
        const container = document.getElementById('artifactGrid');
        const filter = this.currentFilter.artifacts;

        const filteredArtifacts = filter === 'all'
            ? SEAData.artifacts
            : SEAData.artifacts.filter(a => a.type === filter);

        container.innerHTML = filteredArtifacts.map((artifact, i) => `
            <div class="artifact-card" data-danger="${artifact.danger}" style="animation: eventReveal 0.5s ${i * 0.06}s both">
                <div class="artifact-name">${artifact.name}</div>
                <div class="artifact-type">${artifact.type}</div>
                <div class="artifact-description">${artifact.description}</div>
                <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(201, 148, 62, 0.08);">
                    <div style="font-size: 0.8rem; color: var(--ink-dim); font-family: var(--font-accent); font-style: italic;">
                        <span style="color: var(--gold-dark);">Owner:</span> ${artifact.owner}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--ink-dim); font-family: var(--font-accent); font-style: italic; margin-top: 0.15rem;">
                        <span style="color: var(--gold-dark);">Location:</span> ${artifact.location}
                    </div>
                    ${artifact.danger !== 'none' ? `
                        <div style="font-size: 0.75rem; color: var(--danger); font-family: var(--font-accent-sc); letter-spacing: 1px; text-transform: uppercase; margin-top: 0.5rem;">
                            Danger: ${artifact.danger}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Initialize the application when DOM is loaded
let seaArchives;
document.addEventListener('DOMContentLoaded', () => {
    seaArchives = new SEAArchives();
});
