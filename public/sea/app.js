// S.E.A. Archives - Main Application
// Interactive functionality and visualizations

class SEAArchives {
    constructor() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.currentSection = 'home';
        this.currentFilter = {
            timeline: 'all',
            characters: 'all',
            locations: 'all',
            artifacts: 'all',
            family: 'hightower'
        };
        this.lastFocused = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.populateStats();
        this.initializeTimeline();
        this.initializeCharacters();
        this.initializeRelationships();
        this.initializeLocations();
        this.initializeFamilies();
        this.initializeArtifacts();
        this.initDustParticles();

        // Hide loading screen once everything is rendered
        const loadingScreen = document.getElementById('loadingScreen');
        setTimeout(() => loadingScreen.classList.add('hidden'), this.reducedMotion ? 0 : 600);
    }

    // ==================== DUST PARTICLES ====================
    initDustParticles() {
        if (this.reducedMotion) return;

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
    // Hash-based routing: deep links, back/forward, and plain anchors all work.
    setupNavigation() {
        window.addEventListener('hashchange', () => this.handleHash());
        this.handleHash();
    }

    handleHash() {
        const hash = (window.location.hash || '#home').slice(1);
        const target = document.getElementById(hash);
        const section = target && target.classList.contains('section') ? hash : 'home';
        this.showSection(section);
    }

    navigateToSection(section) {
        if (('#' + section) === window.location.hash) return;
        window.location.hash = section;
    }

    showSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
        window.scrollTo({ top: 0, behavior: this.reducedMotion ? 'auto' : 'smooth' });
    }

    // ==================== STATS ====================
    populateStats() {
        const stats = {
            characters: SEAData.characters.length,
            locations: SEAData.locations.length,
            artifacts: SEAData.artifacts.length,
            years: new Date().getFullYear() - 1538
        };

        document.querySelectorAll('.stat-number').forEach(el => {
            const value = stats[el.dataset.stat];
            if (value == null) return;

            if (this.reducedMotion) {
                el.textContent = value;
                return;
            }

            // Count up from zero over ~1s
            const duration = 1000;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                el.textContent = Math.round(value * eased);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    // ==================== SEARCH ====================
    setupSearch() {
        const input = document.getElementById('searchInput');
        const panel = document.getElementById('searchResults');
        let debounceTimer;

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.updateSearchResults(), 120);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) this.updateSearchResults();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
                input.blur();
            } else if (e.key === 'Enter') {
                const first = panel.querySelector('.search-result');
                if (first) first.click();
            } else if (e.key === 'ArrowDown') {
                const first = panel.querySelector('.search-result');
                if (first) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        panel.addEventListener('keydown', (e) => {
            const results = [...panel.querySelectorAll('.search-result')];
            const index = results.indexOf(document.activeElement);
            if (e.key === 'ArrowDown' && index > -1 && index < results.length - 1) {
                e.preventDefault();
                results[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                results[index - 1].focus();
            } else if (e.key === 'ArrowUp' && index === 0) {
                e.preventDefault();
                input.focus();
            } else if (e.key === 'Escape') {
                this.closeSearch();
                input.focus();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) this.closeSearch();
        });
    }

    closeSearch() {
        document.getElementById('searchResults').hidden = true;
    }

    updateSearchResults() {
        const input = document.getElementById('searchInput');
        const panel = document.getElementById('searchResults');
        const query = input.value.toLowerCase().trim();

        if (query.length < 2) {
            panel.hidden = true;
            return;
        }

        const results = this.search(query);
        const total = results.characters.length + results.locations.length +
                      results.artifacts.length + results.timeline.length;

        if (total === 0) {
            panel.innerHTML = `<div class="search-empty">Nothing in the archives matches &ldquo;${this.escapeHtml(input.value.trim())}&rdquo;</div>`;
            panel.hidden = false;
            return;
        }

        const group = (title, items, renderItem) => items.length ? `
            <div class="search-group">
                <div class="search-group-title">${title}</div>
                ${items.slice(0, 5).map(renderItem).join('')}
            </div>
        ` : '';

        panel.innerHTML = `
            ${group('Characters', results.characters, c => `
                <button class="search-result" data-kind="character" data-id="${c.id}">
                    <span class="search-result-name">${c.name}</span>
                    <span class="search-result-meta">${c.occupation}</span>
                </button>
            `)}
            ${group('Locations', results.locations, l => `
                <button class="search-result" data-kind="location" data-name="${this.escapeHtml(l.name)}">
                    <span class="search-result-name">${l.name}</span>
                    <span class="search-result-meta">${l.park}</span>
                </button>
            `)}
            ${group('Artifacts', results.artifacts, a => `
                <button class="search-result" data-kind="artifact" data-name="${this.escapeHtml(a.name)}">
                    <span class="search-result-name">${a.name}</span>
                    <span class="search-result-meta">${a.location}</span>
                </button>
            `)}
            ${group('Timeline', results.timeline, t => `
                <button class="search-result" data-kind="timeline">
                    <span class="search-result-name">${t.title}</span>
                    <span class="search-result-meta">${this.formatDate(t.date)}</span>
                </button>
            `)}
        `;
        panel.hidden = false;

        panel.querySelectorAll('.search-result').forEach(btn => {
            btn.addEventListener('click', () => this.openSearchResult(btn));
        });
    }

    openSearchResult(btn) {
        const kind = btn.dataset.kind;
        this.closeSearch();

        if (kind === 'character') {
            this.navigateToSection('characters');
            this.showCharacterDetail(btn.dataset.id);
        } else if (kind === 'location') {
            this.resetFilter('locations', '.location-filters', 'region');
            this.navigateToSection('locations');
        } else if (kind === 'artifact') {
            this.resetFilter('artifacts', '.artifact-filters', 'type');
            this.navigateToSection('artifacts');
        } else if (kind === 'timeline') {
            this.resetFilter('timeline', '.timeline-filters', 'era');
            this.navigateToSection('timeline');
        }
    }

    // Reset a section's filter to "all" so a search hit is guaranteed to be visible
    resetFilter(section, filterSelector, dataAttr) {
        if (this.currentFilter[section] === 'all') return;
        this.currentFilter[section] = 'all';
        document.querySelectorAll(`${filterSelector} .filter-btn`).forEach(b => {
            b.classList.toggle('active', b.dataset[dataAttr] === 'all');
        });
        if (section === 'timeline') this.renderTimeline();
        if (section === 'locations') this.renderLocations();
        if (section === 'artifacts') this.renderArtifacts();
    }

    escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

        // Event delegation: character cards are re-rendered on every filter change
        document.getElementById('characterGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.character-card');
            if (card) this.showCharacterDetail(card.dataset.id);
        });

        const modal = document.getElementById('characterModal');
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeCharacterModal());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeCharacterModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeCharacterModal();
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
            <button class="character-card" data-id="${char.id}" data-type="${char.type}" style="animation: eventReveal 0.5s ${Math.min(i * 0.05, 1)}s both">
                <div class="character-name">${char.name}</div>
                <div class="character-role">${char.occupation}</div>
                <div class="character-status">${char.status}</div>
            </button>
        `).join('');
    }

    openCharacterModal() {
        const modal = document.getElementById('characterModal');
        this.lastFocused = document.activeElement;
        modal.classList.add('active');
        modal.querySelector('.modal-close').focus();
    }

    closeCharacterModal() {
        const modal = document.getElementById('characterModal');
        modal.classList.remove('active');
        if (this.lastFocused && document.contains(this.lastFocused)) {
            this.lastFocused.focus();
        }
        this.lastFocused = null;
    }

    showCharacterDetail(charId) {
        const char = SEAData.characters.find(c => c.id === charId);
        if (!char) return;

        const modal = document.getElementById('characterModal');
        const content = document.getElementById('characterDetailContent');
        const alreadyOpen = modal.classList.contains('active');

        // Connections that match a known character become links to that character
        const connectionChip = (name) => {
            const target = SEAData.characters.find(c => c.name === name);
            return target
                ? `<button class="detail-chip detail-chip-link" data-character-id="${target.id}">${name}</button>`
                : `<span class="detail-chip">${name}</span>`;
        };

        content.innerHTML = `
            <h2 class="detail-name">${char.name}</h2>
            <p class="detail-occupation">${char.occupation}</p>

            <div class="detail-facts">
                <div>
                    <span class="detail-label">Status</span>
                    <div class="detail-value ${char.type === 'antagonist' ? 'is-antagonist' : ''}">${char.status}</div>
                </div>
                <div>
                    <span class="detail-label">Membership</span>
                    <div class="detail-value">${char.membership}</div>
                </div>
            </div>

            <p class="detail-description">${char.description}</p>

            ${char.connections.length > 0 ? `
                <div class="detail-section">
                    <h4 class="detail-heading">Connections</h4>
                    <div class="detail-chips">
                        ${char.connections.map(connectionChip).join('')}
                    </div>
                </div>
            ` : ''}

            ${char.locations.length > 0 ? `
                <div class="detail-section">
                    <h4 class="detail-heading">Featured Locations</h4>
                    <div class="detail-list detail-list-locations">${char.locations.join(' &bull; ')}</div>
                </div>
            ` : ''}

            ${char.artifacts.length > 0 ? `
                <div class="detail-section">
                    <h4 class="detail-heading">Associated Artifacts</h4>
                    <div class="detail-list detail-list-artifacts">${char.artifacts.join(' &bull; ')}</div>
                </div>
            ` : ''}
        `;

        content.querySelectorAll('.detail-chip-link').forEach(btn => {
            btn.addEventListener('click', () => this.showCharacterDetail(btn.dataset.characterId));
        });

        if (!alreadyOpen) this.openCharacterModal();
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
            <div class="location-card" style="animation: eventReveal 0.5s ${Math.min(i * 0.06, 1)}s both">
                <div class="location-name">${loc.name}</div>
                <div class="location-park">${loc.park} &mdash; ${loc.country}</div>
                <div class="location-description">${loc.description}</div>
                <div class="location-meta">${loc.type} &bull; Opened ${loc.opened}</div>
            </div>
        `).join('');

        // Region summary
        const regionLabels = { asia: 'Asia', america: 'Americas', europe: 'Europe', sea: 'At Sea' };
        const regionCounts = {};
        filteredLocs.forEach(l => {
            regionCounts[l.region] = (regionCounts[l.region] || 0) + 1;
        });

        mapContainer.innerHTML = `
            <div class="map-summary">
                <div class="map-summary-title">Global S.E.A. Presence</div>
                <div class="map-summary-subtitle">
                    ${filteredLocs.length} location${filteredLocs.length !== 1 ? 's' : ''} across ${Object.keys(regionCounts).length} region${Object.keys(regionCounts).length !== 1 ? 's' : ''}
                </div>
                <div class="map-summary-regions">
                    ${Object.entries(regionCounts).map(([region, count]) => `
                        <div class="map-region">
                            <div class="map-region-count">${count}</div>
                            <div class="map-region-name">${regionLabels[region] || region}</div>
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
            <div class="family-tree-inner">
                <h3 class="family-tree-title">${family.name}</h3>
                <div class="family-tree-divider"></div>
                <div class="family-tree-members">
                    ${family.members.map((member, i) => `
                        ${i > 0 ? '<div class="family-connector"></div>' : ''}
                        <div class="family-member" style="animation: eventReveal 0.5s ${i * 0.15}s both">
                            <div class="family-member-name">${member.name}</div>
                            <div class="family-member-dates">${member.dates}</div>
                            <div class="family-member-relation">${this.getRelationLabel(member.relation)}</div>
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
            <div class="artifact-card" data-danger="${artifact.danger}" style="animation: eventReveal 0.5s ${Math.min(i * 0.06, 1)}s both">
                <div class="artifact-name">${artifact.name}</div>
                <div class="artifact-type">${artifact.type}</div>
                <div class="artifact-description">${artifact.description}</div>
                <div class="artifact-facts">
                    <div class="artifact-fact"><span class="artifact-fact-label">Owner:</span> ${artifact.owner}</div>
                    <div class="artifact-fact"><span class="artifact-fact-label">Location:</span> ${artifact.location}</div>
                    ${artifact.danger !== 'none' ? `
                        <div class="artifact-danger">Danger: ${artifact.danger}</div>
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
