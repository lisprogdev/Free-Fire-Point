// Ad Modal Functions for Calculator - REMOVED for AdSense Compliance
// function showAdModal() {
//     const adModal = document.getElementById('adModal');
//     const adModalContent = document.getElementById('adModalContent');
//     
//     if (adModal && adModalContent) {
//         adModal.classList.remove('hidden');
//         adModal.classList.add('show');
//         
//         // Trigger animation
//         setTimeout(() => {
//             adModalContent.classList.add('show');
//         }, 10);
//         
//         // Blur main content
//         const mainContent = document.getElementById('mainContent');
//         if (mainContent) {
//             mainContent.classList.add('blur-active');
//         }
//     }
// }

// function closeAdModal() {
//     const adModal = document.getElementById('adModal');
//     const adModalContent = document.getElementById('adModalContent');
//     
//     if (adModal && adModalContent) {
//         adModalContent.classList.remove('show');
//         
//         setTimeout(() => {
//             adModal.classList.add('hidden');
//             adModal.classList.remove('show');
//         }, 300);
//         
//         // Remove blur from main content
//         const mainContent = document.getElementById('mainContent');
//         if (mainContent) {
//             mainContent.classList.remove('blur-active');
//         }
//     }
// }

// // Close modal when clicking outside
// document.addEventListener('click', function(event) {
//     const adModal = document.getElementById('adModal');
//     
//     if (adModal && !adModal.classList.contains('hidden')) {
//         if (event.target === adModal) {
//             closeAdModal();
//         }
//     }
// });

// // Close modal with Escape key
// document.addEventListener('keydown', function(event) {
//     if (event.key === 'Escape') {
//         const adModal = document.getElementById('adModal');
//         if (adModal && !adModal.classList.contains('hidden')) {
//             closeAdModal();
//         }
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Navigation functionality moved to js/navigation.js

    // Kalkulator Functionality (Elements removed - placeholder for future development)
    const killInput = document.getElementById('killInput');
    const placementInput = document.getElementById('placementInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    const placeholderSection = document.getElementById('placeholderSection');
    const killPointsDisplay = document.getElementById('killPoints');
    const placementPointsDisplay = document.getElementById('placementPoints');
    const totalPointsDisplay = document.getElementById('totalPoints');
    
    // Tournament Calculator Functionality
    const inputTableBody = document.getElementById('inputTableBody');
    const resultsTableBody = document.getElementById('resultsTableBody');
    const saveAllDataBtn = document.getElementById('saveAllData');
    const calculateResultsBtn = document.getElementById('calculateResults');
    const resetAllDataBtn = document.getElementById('resetAllData');
    const downloadJPGBtn = document.getElementById('downloadJPG');

    // IndexedDB Setup
    let db;
    const DB_NAME = 'FFPointCalculator';
    const DB_VERSION = 1;
    const STORE_NAME = 'tournamentData';

    // Initialize IndexedDB
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    // Save data to IndexedDB
    function saveToIndexedDB(data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({
                id: 'current_tournament',
                data: data,
                timestamp: new Date().toISOString()
            });
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Load data from IndexedDB
    function loadFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get('current_tournament');
            
            request.onsuccess = () => {
                resolve(request.result ? request.result.data : null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Alert System
    function showAlert(message, type = 'info') {
        // Create alert container if it doesn't exist
        let alertContainer = document.querySelector('.alert-container');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.className = 'alert-container';
            document.body.appendChild(alertContainer);
        }

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
            ${message}
        `;

        // Add to container
        alertContainer.appendChild(alert);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    // Placement points mapping
    const placementPoints = {
        1: 12,  // BOOYAH
        2: 9,
        3: 8,
        4: 7,
        5: 6,
        6: 5,
        7: 4,
        8: 3,
        9: 2,
        10: 1,
        11: 0,
        12: 0
    };

    // Team data storage
    let teamsData = [];

    // Initialize teams data
    function initializeTeamsData() {
        teamsData = [];
        for (let i = 1; i <= 12; i++) {
            teamsData.push({
                id: i,
                name: `Team ${i}`,
                match1: { rank: 0, kills: 0 },
                match2: { rank: 0, kills: 0 },
                totalPoints: 0
            });
        }
    }

    // Generate input table
    function generateInputTable() {
        if (!inputTableBody) {
            return;
        }
        
        inputTableBody.innerHTML = '';
        
        teamsData.forEach((team, index) => {
            const row = document.createElement('tr');
            row.className = 'bg-slate-800/20 hover:bg-slate-700/30 transition-all duration-300';
            
            row.innerHTML = `
                <td class="px-3 py-3">
                    <input type="text" 
                           value="${team.name}" 
                           class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                           onchange="updateTeamName(${index}, this.value)">
                </td>
                <td class="px-2 py-3">
                    <select class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                            onchange="updateTeamData(${index}, 'match1', 'rank', parseInt(this.value))">
                        <option value="0">-</option>
                        ${generateRankOptions(team.match1.rank)}
                    </select>
                </td>
                <td class="px-2 py-3">
                    <input type="number" 
                           min="0" max="50" 
                           value="${team.match1.kills}" 
                           class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                           onchange="updateTeamData(${index}, 'match1', 'kills', parseInt(this.value) || 0)">
                </td>
                <td class="px-2 py-3">
                    <select class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                            onchange="updateTeamData(${index}, 'match2', 'rank', parseInt(this.value))">
                        <option value="0">-</option>
                        ${generateRankOptions(team.match2.rank)}
                    </select>
                </td>
                <td class="px-2 py-3">
                    <input type="number" 
                           min="0" max="50" 
                           value="${team.match2.kills}" 
                           class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                           onchange="updateTeamData(${index}, 'match2', 'kills', parseInt(this.value) || 0)">
                </td>
            `;
            
            inputTableBody.appendChild(row);
        });
    }

    // Generate rank options for select
    function generateRankOptions(selectedRank) {
        let options = '';
        for (let i = 1; i <= 12; i++) {
            const selected = i === selectedRank ? 'selected' : '';
            options += `<option value="${i}" ${selected}>#${i}</option>`;
        }
        return options;
    }

    // Update team name
    window.updateTeamName = function(index, name) {
        teamsData[index].name = name;
        generateKillStats();
    };

    // Update team data
    window.updateTeamData = function(index, match, field, value) {
        teamsData[index][match][field] = value;
        generateKillStats();
    };

    // Calculate team points
    function calculateTeamPoints(team) {
        const match1Points = (placementPoints[team.match1.rank] || 0) + team.match1.kills;
        const match2Points = (placementPoints[team.match2.rank] || 0) + team.match2.kills;
        return {
            match1: match1Points,
            match2: match2Points,
            total: match1Points + match2Points
        };
    }

    // Generate results table
    function generateResultsTable() {
        // Calculate points for all teams
        const teamsWithPoints = teamsData.map(team => {
            const points = calculateTeamPoints(team);
            return {
                ...team,
                points: points
            };
        });

        // Sort by total points (descending)
        teamsWithPoints.sort((a, b) => b.points.total - a.points.total);

        // Generate table - always show 12 rows
        resultsTableBody.innerHTML = '';
        
        // Ensure we have exactly 12 rows
        for (let i = 0; i < 12; i++) {
            const team = teamsWithPoints[i];
            const row = document.createElement('tr');
            
            if (team) {
                const isWinner = i === 0 && team.points.total > 0;
                
                row.className = `${isWinner ? 'bg-yellow-400/20 border border-yellow-400/30' : 'bg-slate-800/20'} hover:bg-slate-700/30 transition-all duration-300`;
                
                const rankDisplay = i + 1;
                const rankIcon = rankDisplay === 1 ? '<i class="fas fa-crown text-yellow-400 mr-1"></i>' : 
                                 rankDisplay === 2 ? '<i class="fas fa-medal text-gray-400 mr-1"></i>' :
                                 rankDisplay === 3 ? '<i class="fas fa-medal text-amber-600 mr-1"></i>' : '';
                
                row.innerHTML = `
                    <td class="px-3 py-3 text-center">
                        <div class="flex items-center justify-center">
                            ${rankIcon}
                            <span class="font-gaming font-bold ${isWinner ? 'text-yellow-400' : 'text-slate-300'}">#${rankDisplay}</span>
                        </div>
                    </td>
                    <td class="px-3 py-3 text-center">
                        <span class="font-medium ${isWinner ? 'text-yellow-400' : 'text-slate-300'}">${team.name}</span>
                    </td>
                    <td class="px-2 py-3 text-center">
                        <span class="text-slate-300">${team.points.match1}</span>
                    </td>
                    <td class="px-2 py-3 text-center">
                        <span class="text-slate-300">${team.points.match2}</span>
                    </td>
                    <td class="px-3 py-3 text-center">
                        <span class="font-bold text-lg ${isWinner ? 'text-yellow-400' : 'text-slate-200'}">${team.points.total}</span>
                    </td>
                `;
            } else {
                // Empty row for missing teams
                row.className = 'bg-slate-800/20 hover:bg-slate-700/30 transition-all duration-300';
                
                const rankDisplay = i + 1;
                
                row.innerHTML = `
                    <td class="px-3 py-3 text-center">
                        <span class="font-gaming font-bold text-slate-500">#${rankDisplay}</span>
                    </td>
                    <td class="px-3 py-3 text-center">
                        <span class="font-medium text-slate-500">-</span>
                    </td>
                    <td class="px-2 py-3 text-center">
                        <span class="text-slate-500">0</span>
                    </td>
                    <td class="px-2 py-3 text-center">
                        <span class="text-slate-500">0</span>
                    </td>
                    <td class="px-3 py-3 text-center">
                        <span class="font-bold text-lg text-slate-500">0</span>
                    </td>
                `;
            }
            
            resultsTableBody.appendChild(row);
        }

        // Generate kill statistics
        generateKillStats();
    }

    // Generate kill statistics
    function generateKillStats() {
        const killStatsSection = document.getElementById('killStatsSection');
        const killStatsContent = document.getElementById('killStatsContent');
        
        if (!killStatsSection || !killStatsContent) return;

        // Calculate kill statistics
        let maxTotalKills = 0;
        let maxMatch1Kills = 0;
        let maxMatch2Kills = 0;
        let mostKillTeam = null;
        let mostKillMatch1Team = null;
        let mostKillMatch2Team = null;

        teamsData.forEach(team => {
            const totalKills = team.match1.kills + team.match2.kills;
            
            // Total kills
            if (totalKills > maxTotalKills) {
                maxTotalKills = totalKills;
                mostKillTeam = team;
            }
            
            // Match 1 kills
            if (team.match1.kills > maxMatch1Kills) {
                maxMatch1Kills = team.match1.kills;
                mostKillMatch1Team = team;
            }
            
            // Match 2 kills
            if (team.match2.kills > maxMatch2Kills) {
                maxMatch2Kills = team.match2.kills;
                mostKillMatch2Team = team;
            }
        });

        // Check if we have any teams with names (indicating there's data to show)
        const hasTeamData = teamsData.some(team => team.name && team.name.trim() !== '');
        
        if (hasTeamData) {
            killStatsSection.classList.remove('hidden');
            
            killStatsContent.innerHTML = `
                <!-- Total Kills - Full Width -->
                <div class="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 rounded-lg p-4 text-center col-span-full">
                    <div class="flex items-center justify-center mb-2">
                        <i class="fas fa-trophy text-red-400 mr-2"></i>
                        <h4 class="font-gaming font-bold text-red-400">Total Kills</h4>
                    </div>
                    <div class="text-slate-200 font-bold text-lg">${mostKillTeam ? mostKillTeam.name : 'Belum ada data'}</div>
                    <div class="text-red-400 font-bold text-2xl">${maxTotalKills} Kills</div>
                    <div class="text-slate-400 text-xs mt-1">M1: ${mostKillTeam ? mostKillTeam.match1.kills : 0} | M2: ${mostKillTeam ? mostKillTeam.match2.kills : 0}</div>
                </div>

                <!-- Match 1 Kills -->
                <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30 rounded-lg p-4 text-center">
                    <div class="flex items-center justify-center mb-2">
                        <i class="fas fa-crosshairs text-orange-400 mr-2"></i>
                        <h4 class="font-gaming font-bold text-orange-400">Match 1</h4>
                    </div>
                    <div class="text-slate-200 font-bold text-lg">${mostKillMatch1Team ? mostKillMatch1Team.name : 'Belum ada data'}</div>
                    <div class="text-orange-400 font-bold text-2xl">${maxMatch1Kills} Kills</div>
                    <div class="text-slate-400 text-xs mt-1">Highest in Match 1</div>
                </div>

                <!-- Match 2 Kills -->
                <div class="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 rounded-lg p-4 text-center">
                    <div class="flex items-center justify-center mb-2">
                        <i class="fas fa-bullseye text-yellow-400 mr-2"></i>
                        <h4 class="font-gaming font-bold text-yellow-400">Match 2</h4>
                    </div>
                    <div class="text-slate-200 font-bold text-lg">${mostKillMatch2Team ? mostKillMatch2Team.name : 'Belum ada data'}</div>
                    <div class="text-yellow-400 font-bold text-2xl">${maxMatch2Kills} Kills</div>
                    <div class="text-slate-400 text-xs mt-1">Highest in Match 2</div>
                </div>
            `;
        } else {
            killStatsSection.classList.add('hidden');
        }
    }

    // Event listeners
    if (saveAllDataBtn) {
        saveAllDataBtn.addEventListener('click', async function() {
            // Show ad modal first
            showAdModal();
            
            try {
                // Get tournament info
                const tournamentName = document.getElementById('tournamentName')?.value || '';
                const tournamentPhase = document.getElementById('tournamentPhase')?.value || '';
                
                // Create data object with tournament info and teams data
                const dataToSave = {
                    tournamentName: tournamentName,
                    tournamentPhase: tournamentPhase,
                    teamsData: teamsData,
                    savedAt: new Date().toISOString()
                };
                
                // Save to IndexedDB
                await saveToIndexedDB(dataToSave);
                
                // Show success alert
                showAlert('Data turnamen berhasil disimpan!', 'success');
                
            } catch (error) {
                showAlert('Gagal menyimpan data. Silakan coba lagi.', 'error');
            }
        });
    }

    if (calculateResultsBtn) {
        calculateResultsBtn.addEventListener('click', function() {
            // Show ad modal first
            showAdModal();
            
            generateResultsTable();
            showAlert('Hasil berhasil dihitung!', 'success');
        });
    }

    // Reset All Data Button
    if (resetAllDataBtn) {
        resetAllDataBtn.addEventListener('click', function() {
            // Show ad modal first
            showAdModal();
            
            showResetModal();
        });
    }



    // Download JPG Button
    if (downloadJPGBtn) {
        downloadJPGBtn.addEventListener('click', function() {
            // Show ad modal first
            showAdModal();
            
            const resultsTableBody = document.getElementById('resultsTableBody');
            const tournamentName = document.getElementById('tournamentName');
            const tournamentPhase = document.getElementById('tournamentPhase');
            
            if (!resultsTableBody || resultsTableBody.children.length === 0) {
                showAlert('Tidak ada data hasil untuk diunduh!', 'error');
                return;
            }

            // Get tournament info
            const tournamentNameValue = tournamentName ? tournamentName.value.trim() : '';
            const tournamentPhaseValue = tournamentPhase ? tournamentPhase.value.trim() : '';

            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengunduh...';
            this.disabled = true;

            // Create a clean export container with inline styles only
            const exportContainer = document.createElement('div');
            exportContainer.style.cssText = `
                position: absolute;
                left: -9999px;
                top: 0;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                padding: 30px;
                border-radius: 15px;
                width: 1020px;
                height: 1290px;
                font-family: 'Arial', sans-serif;
                color: white;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            `;
            
            // Create title
            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = `
                text-align: center;
                margin-bottom: 25px;
                padding: 25px 20px;
                background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
                border-radius: 12px;
                border: 2px solid rgba(251, 191, 36, 0.2);
                flex-shrink: 0;
            `;
            titleDiv.innerHTML = `
                <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 12px 0; color: #fbbf24; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); letter-spacing: 0.5px;">HASIL PERINGKAT TURNAMEN</h1>
                <h2 style="font-size: 20px; margin: 0 0 8px 0; color: #e2e8f0; font-weight: 600;">${tournamentNameValue || 'TURNAMEN FREE FIRE'}</h2>
                <h3 style="font-size: 16px; margin: 0 0 15px 0; color: #94a3b8; font-weight: normal; font-style: italic;">${tournamentPhaseValue || 'Babak Penyisihan'}</h3>
                <div style="width: 80px; height: 2px; background: linear-gradient(90deg, #fbbf24, #f59e0b); margin: 0 auto 10px auto; border-radius: 1px;"></div>
                <p style="font-size: 14px; margin: 0; color: #64748b; font-weight: 500;">
                    Kalkulator Poin Free Fire Indonesia
                </p>
            `;
            
            // Create table container
            const tableContainer = document.createElement('div');
            tableContainer.style.cssText = `
                background: linear-gradient(135deg, #334155 0%, #475569 100%);
                border-radius: 12px;
                padding: 20px;
                margin: 0;
                border: 2px solid #475569;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                flex: 1;
                display: flex;
                flex-direction: column;
            `;
            
            // Create table
            const table = document.createElement('table');
            table.style.cssText = `
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                font-size: 14px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                flex: 1;
            `;
            
            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background: linear-gradient(135deg, #eab308 0%, #d97706 100%); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <th style="color: #1f2937; font-weight: bold; padding: 14px 10px; text-align: center; font-size: 12px; text-transform: uppercase; border-top-left-radius: 8px; letter-spacing: 0.3px;">Peringkat</th>
                    <th style="color: #1f2937; font-weight: bold; padding: 14px 10px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3px;">Nama Tim</th>
                    <th style="color: #1f2937; font-weight: bold; padding: 14px 10px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3px;" colspan="2">Poin</th>
                    <th style="color: #1f2937; font-weight: bold; padding: 14px 10px; text-align: center; font-size: 12px; text-transform: uppercase; border-top-right-radius: 8px; letter-spacing: 0.3px;">Total</th>
                </tr>
                <tr style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);">
                    <th style="color: #1f2937; font-weight: bold; padding: 10px; text-align: center; font-size: 10px; border-bottom: 2px solid #d97706;"></th>
                    <th style="color: #1f2937; font-weight: bold; padding: 10px; text-align: center; font-size: 10px; border-bottom: 2px solid #d97706;"></th>
                    <th style="color: #1f2937; font-weight: bold; padding: 10px; text-align: center; font-size: 10px; border-bottom: 2px solid #d97706;">M1</th>
                    <th style="color: #1f2937; font-weight: bold; padding: 10px; text-align: center; font-size: 10px; border-bottom: 2px solid #d97706;">M2</th>
                    <th style="color: #1f2937; font-weight: bold; padding: 10px; text-align: center; font-size: 10px; border-bottom: 2px solid #d97706;">Poin</th>
                </tr>
            `;
            
            // Create table body
            const tbody = document.createElement('tbody');
            
            // Copy data from original table
            const originalRows = resultsTableBody.querySelectorAll('tr');
            originalRows.forEach((originalRow, index) => {
                const cells = originalRow.querySelectorAll('td');
                if (cells.length >= 5) {
                    const row = document.createElement('tr');
                    const bgColor = index % 2 === 0 ? 'rgba(51, 65, 85, 0.4)' : 'rgba(71, 85, 105, 0.3)';
                    const hoverColor = index % 2 === 0 ? 'rgba(51, 65, 85, 0.6)' : 'rgba(71, 85, 105, 0.5)';
                    row.style.cssText = `
                        background: ${bgColor};
                        transition: all 0.3s ease;
                        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                    `;
                    
                    // Special styling for rank #1
                    const isFirstPlace = cells[0].textContent.includes('#1');
                    const rankColor = isFirstPlace ? '#fbbf24' : '#e2e8f0';
                    const rankBg = isFirstPlace ? 'rgba(251, 191, 36, 0.1)' : 'transparent';
                    
                    row.innerHTML = `
                        <td style="color: ${rankColor}; background: ${rankBg}; padding: 12px 8px; text-align: center; font-size: 12px; font-weight: bold; border-right: 1px solid rgba(148, 163, 184, 0.1);">${cells[0].textContent}</td>
                        <td style="color: #e2e8f0; padding: 12px 8px; text-align: center; font-size: 12px; font-weight: 500; border-right: 1px solid rgba(148, 163, 184, 0.1);">${cells[1].textContent}</td>
                        <td style="color: #e2e8f0; padding: 12px 8px; text-align: center; font-size: 12px; border-right: 1px solid rgba(148, 163, 184, 0.1);">${cells[2].textContent}</td>
                        <td style="color: #e2e8f0; padding: 12px 8px; text-align: center; font-size: 12px; border-right: 1px solid rgba(148, 163, 184, 0.1);">${cells[3].textContent}</td>
                        <td style="color: #fbbf24; padding: 12px 8px; text-align: center; font-size: 13px; font-weight: bold; background: rgba(251, 191, 36, 0.1);">${cells[4].textContent}</td>
                    `;
                    tbody.appendChild(row);
                }
            });
            
            table.appendChild(thead);
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            
            // Add Most Kill Team Statistics to poster
            const killStatsDiv = document.createElement('div');
            killStatsDiv.style.cssText = `
                margin-top: 15px;
                padding: 15px;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 101, 101, 0.1) 100%);
                border-radius: 10px;
                border: 2px solid rgba(239, 68, 68, 0.2);
                flex-shrink: 0;
            `;
            
            // Calculate kill statistics
            let maxTotalKills = 0;
            let maxMatch1Kills = 0;
            let maxMatch2Kills = 0;
            let mostKillTeam = null;
            let mostKillMatch1Team = null;
            let mostKillMatch2Team = null;

            teamsData.forEach(team => {
                const totalKills = team.match1.kills + team.match2.kills;
                
                if (totalKills > maxTotalKills) {
                    maxTotalKills = totalKills;
                    mostKillTeam = team;
                }
                
                if (team.match1.kills > maxMatch1Kills) {
                    maxMatch1Kills = team.match1.kills;
                    mostKillMatch1Team = team;
                }
                
                if (team.match2.kills > maxMatch2Kills) {
                    maxMatch2Kills = team.match2.kills;
                    mostKillMatch2Team = team;
                }
            });

            killStatsDiv.innerHTML = `
                <div style="text-align: center; margin-bottom: 12px;">
                    <h3 style="color: #ef4444; font-size: 16px; font-weight: bold; margin: 0; display: flex; align-items: center; justify-content: center;">
                        MOST KILL TEAM STATISTICS
                    </h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- Total Kills - Full Width -->
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 10px; text-align: center;">
                        <div style="color: #ef4444; font-size: 11px; font-weight: bold; margin-bottom: 4px;">TOTAL KILLS</div>
                        <div style="color: #e2e8f0; font-size: 13px; font-weight: bold; margin-bottom: 2px;">${mostKillTeam ? mostKillTeam.name : '-'}</div>
                        <div style="color: #ef4444; font-size: 16px; font-weight: bold;">${maxTotalKills} Kills</div>
                        <div style="color: #94a3b8; font-size: 9px; margin-top: 2px;">M1: ${mostKillTeam ? mostKillTeam.match1.kills : 0} | M2: ${mostKillTeam ? mostKillTeam.match2.kills : 0}</div>
                    </div>
                    <!-- Match 1 and 2 - Side by Side -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 10px; text-align: center;">
                            <div style="color: #f59e0b; font-size: 11px; font-weight: bold; margin-bottom: 4px;">MATCH 1</div>
                            <div style="color: #e2e8f0; font-size: 13px; font-weight: bold; margin-bottom: 2px;">${mostKillMatch1Team ? mostKillMatch1Team.name : '-'}</div>
                            <div style="color: #f59e0b; font-size: 16px; font-weight: bold;">${maxMatch1Kills} Kills</div>
                            <div style="color: #94a3b8; font-size: 9px; margin-top: 2px;">Terbanyak Match 1</div>
                        </div>
                        <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 10px; text-align: center;">
                            <div style="color: #fbbf24; font-size: 11px; font-weight: bold; margin-bottom: 4px;">MATCH 2</div>
                            <div style="color: #e2e8f0; font-size: 13px; font-weight: bold; margin-bottom: 2px;">${mostKillMatch2Team ? mostKillMatch2Team.name : '-'}</div>
                            <div style="color: #fbbf24; font-size: 16px; font-weight: bold;">${maxMatch2Kills} Kills</div>
                            <div style="color: #94a3b8; font-size: 9px; margin-top: 2px;">Terbanyak Match 2</div>
                        </div>
                    </div>
                </div>
            `;
            
            tableContainer.appendChild(killStatsDiv);
            
            // Create footer
            const footerDiv = document.createElement('div');
            footerDiv.style.cssText = `
                text-align: center;
                margin-top: 20px;
                padding: 15px 20px;
                background: linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(51, 65, 85, 0.3) 100%);
                border-radius: 10px;
                border: 1px solid rgba(148, 163, 184, 0.2);
                color: #64748b;
                font-size: 10px;
                flex-shrink: 0;
            `;
            footerDiv.innerHTML = `
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #fbbf24; font-size: 12px; text-align: center;">© 2024 Free Fire Point Calculator Indonesia</p>
                <p style="margin: 0 0 5px 0; color: #e2e8f0; font-size: 11px; text-align: center;">Dibuat oleh <span style="color: #fbbf24; font-weight: 600;">Tekno Ogi</span> | Kalkulator Poin FF Terpercaya</p>
                <p style="margin: 0; font-size: 9px; color: #94a3b8; font-style: italic; text-align: center;">Semua hak cipta dilindungi undang-undang</p>
            `;
            
            // Assemble the export container
            exportContainer.appendChild(titleDiv);
            exportContainer.appendChild(tableContainer);
            exportContainer.appendChild(footerDiv);
            
            document.body.appendChild(exportContainer);

            // Create iframe for completely isolated rendering
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '1080px';
            iframe.style.height = '1350px';
            document.body.appendChild(iframe);
            
            // Write clean HTML to iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            background: linear-gradient(135deg, #1e293b 0%, #334155 100%); 
                            font-family: 'Arial', sans-serif; 
                            color: white; 
                            padding: 40px;
                            min-height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .container {
                            width: 1020px;
                            height: 1290px;
                            margin: 0 auto;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${exportContainer.innerHTML}
                    </div>
                </body>
                </html>
            `);
            iframeDoc.close();
            
            // Wait for iframe to load then capture
            setTimeout(() => {
                html2canvas(iframe.contentDocument.body, {
                    backgroundColor: '#1e293b',
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    width: 1080,
                    height: 1350,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 1080,
                    windowHeight: 1350
                }).then(canvas => {
                // Convert to JPG and download
                const link = document.createElement('a');
                const fileName = tournamentNameValue 
                    ? `Hasil-${tournamentNameValue.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.jpg`
                    : `Hasil-Turnamen-FF-${new Date().toISOString().split('T')[0]}.jpg`;
                link.download = fileName;
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.click();
                
                // Clean up
                document.body.removeChild(exportContainer);
                document.body.removeChild(iframe);
                
                // Reset button state
                this.innerHTML = '<i class="fas fa-download mr-2"></i>Download JPG';
                this.disabled = false;
                
                showAlert('Hasil turnamen berhasil diunduh!', 'success');
                
            }).catch(error => {
                document.body.removeChild(exportContainer);
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                
                // Reset button state
                this.innerHTML = '<i class="fas fa-download mr-2"></i>Download JPG';
                this.disabled = false;
                
                showAlert('Gagal mengunduh hasil. Silakan coba lagi.', 'error');
            });
            }, 500); // Wait 500ms for iframe to fully load
        });
    }

    // Certificate Buttons
    const downloadCertificate1Btn = document.getElementById('downloadCertificate1');
    const downloadCertificate2Btn = document.getElementById('downloadCertificate2');
    const downloadCertificate3Btn = document.getElementById('downloadCertificate3');
    const downloadCertificateKillBtn = document.getElementById('downloadCertificateKill');
    const certificateStatus = document.getElementById('certificateStatus');
    const certificatePreviewGrid = document.getElementById('certificatePreviewGrid');
    
    // Function to get winners and most kill team
    function getWinnersData() {
        const teamsWithPoints = teamsData.map(team => {
            const points = calculateTeamPoints(team);
            return {
                ...team,
                points: points
            };
        });
        
        teamsWithPoints.sort((a, b) => b.points.total - a.points.total);
        
        // Get top 3
        const winner1 = teamsWithPoints[0];
        const winner2 = teamsWithPoints[1];
        const winner3 = teamsWithPoints[2];
        
        // Get most kill team
        let maxTotalKills = 0;
        let mostKillTeam = null;
        teamsData.forEach(team => {
            const totalKills = team.match1.kills + team.match2.kills;
            if (totalKills > maxTotalKills) {
                maxTotalKills = totalKills;
                mostKillTeam = team;
            }
        });
        
        return { winner1, winner2, winner3, mostKillTeam };
    }
    
    // Function to generate certificate preview
    function generateCertificatePreview() {
        if (!certificatePreviewGrid) return;
        
        const { winner1, winner2, winner3, mostKillTeam } = getWinnersData();
        const tournamentName = document.getElementById('tournamentName')?.value || 'Turnamen Free Fire';
        const tournamentPhase = document.getElementById('tournamentPhase')?.value || 'Babak Final';
        
        certificatePreviewGrid.innerHTML = '';
        
        // Preview 1 - Juara 1
        if (winner1 && winner1.points.total > 0) {
            const preview1 = createPreviewCard('Juara 1', winner1.name, '#fbbf24', winner1);
            certificatePreviewGrid.appendChild(preview1);
        }
        
        // Preview 2 - Juara 2
        if (winner2 && winner2.points.total > 0) {
            const preview2 = createPreviewCard('Juara 2', winner2.name, '#94a3b8', winner2);
            certificatePreviewGrid.appendChild(preview2);
        }
        
        // Preview 3 - Juara 3
        if (winner3 && winner3.points.total > 0) {
            const preview3 = createPreviewCard('Juara 3', winner3.name, '#d97706', winner3);
            certificatePreviewGrid.appendChild(preview3);
        }
        
        // Preview 4 - Most Kill Team
        if (mostKillTeam && (mostKillTeam.match1.kills + mostKillTeam.match2.kills) > 0) {
            const preview4 = createPreviewCard('Most Kill Team', mostKillTeam.name, '#ef4444', mostKillTeam, true);
            certificatePreviewGrid.appendChild(preview4);
        }
    }
    
    // Function to create preview card
    function createPreviewCard(title, teamName, color, team, isKill = false) {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-lg rounded-xl p-4 border-2 transition-all hover:scale-105';
        card.style.borderColor = color;
        card.innerHTML = `
            <div class="text-center">
                <div class="mb-3">
                    <div class="text-sm font-gaming font-bold mb-2" style="color: ${color};">
                        <i class="fas fa-trophy mr-2"></i>${title}
                    </div>
                    <div class="text-lg font-bold text-slate-200">${teamName}</div>
                </div>
                <div class="w-full aspect-[8/5] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-2 overflow-hidden relative" style="border-color: ${color};">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center p-4">
                            <div style="color: ${color}; font-size: 14px; font-weight: bold; margin-bottom: 8px;">SERTIFIKAT JUARA</div>
                            <div style="color: ${color}; font-size: 20px; font-weight: bold; margin-bottom: 4px;">TURNAMEN FREE FIRE</div>
                            <div style="color: #e2e8f0; font-size: 16px; font-weight: 600; margin-top: 12px;">${teamName}</div>
                            <div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Sebagai ${title}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return card;
    }
    
    // Function to update certificate button state
    function updateCertificateButtonState() {
        const { winner1, winner2, winner3, mostKillTeam } = getWinnersData();
        
        // Update buttons
        if (downloadCertificate1Btn) {
            downloadCertificate1Btn.disabled = !(winner1 && winner1.points.total > 0);
        }
        if (downloadCertificate2Btn) {
            downloadCertificate2Btn.disabled = !(winner2 && winner2.points.total > 0);
        }
        if (downloadCertificate3Btn) {
            downloadCertificate3Btn.disabled = !(winner3 && winner3.points.total > 0);
        }
        if (downloadCertificateKillBtn) {
            const hasKills = mostKillTeam && (mostKillTeam.match1.kills + mostKillTeam.match2.kills) > 0;
            downloadCertificateKillBtn.disabled = !hasKills;
        }
        
        // Update preview
        generateCertificatePreview();
        
        // Update status
        if (certificateStatus) {
            const hasData = (winner1 && winner1.points.total > 0) || 
                           (mostKillTeam && (mostKillTeam.match1.kills + mostKillTeam.match2.kills) > 0);
            if (!hasData) {
                certificateStatus.textContent = 'Harap hitung hasil turnamen terlebih dahulu untuk membuat sertifikat.';
                certificateStatus.classList.remove('hidden');
            } else {
                certificateStatus.classList.add('hidden');
            }
        }
    }
    
    // Update button state when results are calculated
    const originalGenerateResultsTable = generateResultsTable;
    generateResultsTable = function() {
        originalGenerateResultsTable();
        setTimeout(updateCertificateButtonState, 100);
    };
    
    // Function to generate horizontal certificate
    function generateHorizontalCertificate(team, rank, rankText, rankColor, tournamentName, tournamentPhase, isKillTeam = false) {
        return new Promise((resolve, reject) => {
            // Show loading state
            const btnId = isKillTeam ? 'downloadCertificateKill' : `downloadCertificate${rank}`;
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Membuat...';
                btn.disabled = true;
            }
            
            // Create certificate container (horizontal: 1600x1000)
            const certificateContainer = document.createElement('div');
            certificateContainer.style.cssText = `
                position: absolute;
                left: -9999px;
                top: 0;
                width: 1600px;
                height: 1000px;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                font-family: 'Arial', sans-serif;
                color: white;
                display: flex;
                box-sizing: border-box;
            `;
            
            // Load images first
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            
            const logoImage = new Image();
            logoImage.crossOrigin = 'anonymous';
            logoImage.src = basePath + '/../../images/Logo/Logo.png';
            
            const booyahImage = new Image();
            booyahImage.crossOrigin = 'anonymous';
            booyahImage.src = basePath + '/../../images/Logo/Booyah Logo.png';
            
            const ffLogoImage = new Image();
            ffLogoImage.crossOrigin = 'anonymous';
            ffLogoImage.src = basePath + '/../../images/Logo/Logo FF.png';
            
            const lunaImage = new Image();
            lunaImage.crossOrigin = 'anonymous';
            lunaImage.src = basePath + '/../../images/element/Luna FF.png';
            
            Promise.all([
                new Promise((res, rej) => {
                    logoImage.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = logoImage.width;
                        canvas.height = logoImage.height;
                        ctx.drawImage(logoImage, 0, 0);
                        res(canvas.toDataURL('image/png'));
                    };
                    logoImage.onerror = () => res(null);
                }),
                new Promise((res, rej) => {
                    booyahImage.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = booyahImage.width;
                        canvas.height = booyahImage.height;
                        ctx.drawImage(booyahImage, 0, 0);
                        res(canvas.toDataURL('image/png'));
                    };
                    booyahImage.onerror = () => res(null);
                }),
                new Promise((res, rej) => {
                    ffLogoImage.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = ffLogoImage.width;
                        canvas.height = ffLogoImage.height;
                        ctx.drawImage(ffLogoImage, 0, 0);
                        res(canvas.toDataURL('image/png'));
                    };
                    ffLogoImage.onerror = () => res(null);
                }),
                new Promise((res, rej) => {
                    lunaImage.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = lunaImage.width;
                        canvas.height = lunaImage.height;
                        ctx.drawImage(lunaImage, 0, 0);
                        res(canvas.toDataURL('image/png'));
                    };
                    lunaImage.onerror = () => res(null);
                })
            ]).then(([logoBase64, booyahBase64, ffBase64, lunaBase64]) => {
                // Create certificate HTML (without decorative elements)
                certificateContainer.innerHTML = `
                    <div style="width: 100%; height: 100%; min-height: 1000px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%); border: 4px solid ${rankColor}; border-radius: 20px; padding: 0; display: flex; position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); overflow: hidden;">
                        <!-- Luna Character as Background Image -->
                        ${lunaBase64 ? `
                        <div style="position: absolute; left: 0; top: 0; width: 500px; height: 100%; z-index: 1; opacity: 0.12; pointer-events: none; display: flex; align-items: flex-end;">
                            <img src="${lunaBase64}" alt="Luna FF Background" style="width: 100%; height: auto; max-height: 80%; object-fit: contain; object-position: left bottom;">
                        </div>
                        ` : ''}
                        
                        <!-- Decorative Gaming Corners -->
                        <!-- Top Left Corner -->
                        <div style="position: absolute; top: 20px; left: 20px; width: 120px; height: 120px; z-index: 15; opacity: 0.7;">
                            <div style="width: 100%; height: 100%; border: 4px solid ${rankColor}; border-right: none; border-bottom: none; border-radius: 10px 0 0 0; position: relative; box-shadow: 0 0 20px ${rankColor}40;">
                                <div style="position: absolute; top: -4px; left: -4px; width: 24px; height: 24px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 20px ${rankColor}80, inset 0 0 10px rgba(255,255,255,0.3);"></div>
                                <div style="position: absolute; top: 15px; left: 15px; width: 10px; height: 10px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 12px ${rankColor}60;"></div>
                                <div style="position: absolute; top: 35px; left: 35px; width: 6px; height: 6px; background: ${rankColor}; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; top: 50px; left: 50px; width: 3px; height: 3px; background: ${rankColor}; border-radius: 50%; opacity: 0.6;"></div>
                            </div>
                        </div>
                        
                        <!-- Top Right Corner -->
                        <div style="position: absolute; top: 20px; right: 20px; width: 120px; height: 120px; z-index: 15; opacity: 0.7;">
                            <div style="width: 100%; height: 100%; border: 4px solid ${rankColor}; border-left: none; border-bottom: none; border-radius: 0 10px 0 0; position: relative; box-shadow: 0 0 20px ${rankColor}40;">
                                <div style="position: absolute; top: -4px; right: -4px; width: 24px; height: 24px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 20px ${rankColor}80, inset 0 0 10px rgba(255,255,255,0.3);"></div>
                                <div style="position: absolute; top: 15px; right: 15px; width: 10px; height: 10px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 12px ${rankColor}60;"></div>
                                <div style="position: absolute; top: 35px; right: 35px; width: 6px; height: 6px; background: ${rankColor}; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; top: 50px; right: 50px; width: 3px; height: 3px; background: ${rankColor}; border-radius: 50%; opacity: 0.6;"></div>
                            </div>
                        </div>
                        
                        <!-- Bottom Left Corner -->
                        <div style="position: absolute; bottom: 20px; left: 20px; width: 120px; height: 120px; z-index: 15; opacity: 0.7;">
                            <div style="width: 100%; height: 100%; border: 4px solid ${rankColor}; border-right: none; border-top: none; border-radius: 0 0 0 10px; position: relative; box-shadow: 0 0 20px ${rankColor}40;">
                                <div style="position: absolute; bottom: -4px; left: -4px; width: 24px; height: 24px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 20px ${rankColor}80, inset 0 0 10px rgba(255,255,255,0.3);"></div>
                                <div style="position: absolute; bottom: 15px; left: 15px; width: 10px; height: 10px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 12px ${rankColor}60;"></div>
                                <div style="position: absolute; bottom: 35px; left: 35px; width: 6px; height: 6px; background: ${rankColor}; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; bottom: 50px; left: 50px; width: 3px; height: 3px; background: ${rankColor}; border-radius: 50%; opacity: 0.6;"></div>
                            </div>
                        </div>
                        
                        <!-- Bottom Right Corner -->
                        <div style="position: absolute; bottom: 20px; right: 20px; width: 120px; height: 120px; z-index: 15; opacity: 0.7;">
                            <div style="width: 100%; height: 100%; border: 4px solid ${rankColor}; border-left: none; border-top: none; border-radius: 0 0 10px 0; position: relative; box-shadow: 0 0 20px ${rankColor}40;">
                                <div style="position: absolute; bottom: -4px; right: -4px; width: 24px; height: 24px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 20px ${rankColor}80, inset 0 0 10px rgba(255,255,255,0.3);"></div>
                                <div style="position: absolute; bottom: 15px; right: 15px; width: 10px; height: 10px; background: ${rankColor}; border-radius: 50%; box-shadow: 0 0 12px ${rankColor}60;"></div>
                                <div style="position: absolute; bottom: 35px; right: 35px; width: 6px; height: 6px; background: ${rankColor}; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; bottom: 50px; right: 50px; width: 3px; height: 3px; background: ${rankColor}; border-radius: 50%; opacity: 0.6;"></div>
                            </div>
                        </div>
                        
                        <!-- Center Content -->
                        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; position: relative; padding: 60px 50px; min-height: 100%; z-index: 10;">
                            <!-- Top Left - Logo and Brand Name -->
                            <div style="position: absolute; top: 40px; left: 40px; display: flex; align-items: center; gap: 15px; z-index: 30; background: rgba(15, 23, 42, 0.8); padding: 10px 15px; border-radius: 10px; backdrop-filter: blur(5px);">
                                ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="height: 75px; width: auto; filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));">` : ''}
                                <div>
                                    <div style="font-size: 24px; font-weight: bold; color: #fbbf24; line-height: 1.2; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7); letter-spacing: 1.5px;">FREE FIRE</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #fbbf24; line-height: 1.2; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7); letter-spacing: 1.5px;">POINT</div>
                                </div>
                            </div>
                            
                            <!-- Top Right - Booyah and FF Logo (Horizontal, Same Size) -->
                            <div style="position: absolute; top: 40px; right: 40px; display: flex; flex-direction: row; align-items: center; gap: 10px; z-index: 30; background: rgba(15, 23, 42, 0.8); padding: 8px 12px; border-radius: 10px; backdrop-filter: blur(5px);">
                                ${booyahBase64 ? `<img src="${booyahBase64}" alt="Booyah" style="height: 35px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));">` : ''}
                                ${ffBase64 ? `<img src="${ffBase64}" alt="FF Logo" style="height: 35px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));">` : ''}
                            </div>
                            
                            <!-- Main Content -->
                            <div style="max-width: 1000px; width: 100%; position: relative; z-index: 10;">
                                <div style="font-size: 26px; color: ${rankColor}; font-weight: bold; letter-spacing: 5px; text-transform: uppercase; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7); margin-bottom: 8px;">SERTIFIKAT JUARA</div>
                                
                                <div style="font-size: 48px; color: ${rankColor}; font-weight: bold; margin-bottom: 20px; text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.7); letter-spacing: 3px; margin-top: -5px;">TURNAMEN FREE FIRE</div>
                                
                                <!-- Tournament Name with decorative lines -->
                                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px; gap: 15px;">
                                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, ${rankColor}80, ${rankColor}); align-self: center;"></div>
                                    <div style="font-size: 26px; color: #e2e8f0; font-weight: 600; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); white-space: nowrap; line-height: 1; display: flex; align-items: center;">${tournamentName}</div>
                                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, ${rankColor}, ${rankColor}80, transparent); align-self: center;"></div>
                                </div>
                                
                                <!-- Tournament Phase with decorative lines -->
                                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 55px; gap: 12px;">
                                    <div style="width: 50px; height: 1.5px; background: linear-gradient(90deg, transparent, ${rankColor}60, ${rankColor}40); align-self: center;"></div>
                                    <div style="font-size: 20px; color: #94a3b8; font-style: italic; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); white-space: nowrap; line-height: 1; display: flex; align-items: center;">${tournamentPhase}</div>
                                    <div style="width: 50px; height: 1.5px; background: linear-gradient(90deg, ${rankColor}40, ${rankColor}60, transparent); align-self: center;"></div>
                                </div>
                                
                                <div style="font-size: 22px; color: #94a3b8; margin-bottom: 30px; font-style: italic; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">Dengan bangga menyatakan bahwa</div>
                                
                                <!-- Team Name -->
                                <div style="margin-bottom: 35px;">
                                    <div style="font-size: 80px; color: ${rankColor}; font-weight: bold; text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.8), 0 0 20px ${rankColor}40; letter-spacing: 5px; text-transform: uppercase; line-height: 1.1;">
                                        ${team.name}
                                    </div>
                                </div>
                                
                                <div style="font-size: 40px; color: #e2e8f0; font-weight: 600; margin-bottom: 20px; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);">Sebagai ${rankText}</div>
                                
                                <!-- Thank You Message -->
                                <div style="font-size: 18px; color: #94a3b8; font-style: italic; margin-bottom: 70px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); line-height: 1.6; max-width: 800px; margin-left: auto; margin-right: auto;">
                                    Terima kasih atas dedikasi, kerja keras, dan semangat juang yang luar biasa<br>
                                    dalam turnamen ini. Prestasi ini adalah bukti dari komitmen dan kemampuan tim yang hebat.
                                </div>
                                
                                <!-- Footer -->
                                <div style="margin-top: 70px; padding-top: 35px; border-top: 2px solid ${rankColor}30;">
                                    <div style="font-size: 16px; color: #64748b; margin-bottom: 12px; font-weight: 500; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">Diterbitkan pada ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    <div style="font-size: 14px; color: #475569; font-style: italic; margin-bottom: 6px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">Free Fire Point Calculator Indonesia</div>
                                    <div style="font-size: 12px; color: #64748b; margin-top: 6px; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">© 2025 Tekno Ogi - Kalkulator Poin FF Terpercaya</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(certificateContainer);
                
                // Create iframe
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                iframe.style.width = '1600px';
                iframe.style.height = '1000px';
                document.body.appendChild(iframe);
                
                // Write to iframe
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body { 
                                background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); 
                                font-family: 'Arial', sans-serif; 
                                color: white; 
                                padding: 0;
                                margin: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                            }
                        </style>
                    </head>
                    <body>
                        ${certificateContainer.innerHTML}
                    </body>
                    </html>
                `);
                iframeDoc.close();
                
                setTimeout(() => {
                    html2canvas(iframe.contentDocument.body, {
                        backgroundColor: '#0f172a',
                        scale: 2,
                        logging: false,
                        useCORS: true,
                        allowTaint: true,
                        width: 1600,
                        height: 1000,
                        scrollX: 0,
                        scrollY: 0,
                        windowWidth: 1600,
                        windowHeight: 1000
                    }).then(canvas => {
                        const link = document.createElement('a');
                        const fileName = `Sertifikat-${rankText.replace(/\s+/g, '-')}-${team.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.jpg`;
                        link.download = fileName;
                        link.href = canvas.toDataURL('image/jpeg', 0.95);
                        link.click();
                        
                        document.body.removeChild(certificateContainer);
                        document.body.removeChild(iframe);
                        
                        if (btn) {
                            btn.innerHTML = isKillTeam ? '<i class="fas fa-download mr-2"></i>Download Most Kill' : `<i class="fas fa-download mr-2"></i>Download Juara ${rank}`;
                            btn.disabled = false;
                        }
                        
                        showAlert(`Sertifikat ${rankText} berhasil diunduh!`, 'success');
                        resolve();
                    }).catch(error => {
                        console.error('Error generating certificate:', error);
                        document.body.removeChild(certificateContainer);
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                        
                        if (btn) {
                            btn.innerHTML = isKillTeam ? '<i class="fas fa-download mr-2"></i>Download Most Kill' : `<i class="fas fa-download mr-2"></i>Download Juara ${rank}`;
                            btn.disabled = false;
                        }
                        
                        showAlert('Gagal membuat sertifikat. Silakan coba lagi.', 'error');
                        reject(error);
                    });
                }, 1000);
            }).catch(error => {
                console.error('Error loading images:', error);
                reject(error);
            });
        });
    }
    
    // Function to validate tournament information
    function validateTournamentInfo() {
        const tournamentName = document.getElementById('tournamentName')?.value.trim();
        const tournamentPhase = document.getElementById('tournamentPhase')?.value.trim();
        
        if (!tournamentName || tournamentName === '') {
            showAlert('Harap isi Nama Turnamen terlebih dahulu!', 'error');
            document.getElementById('tournamentName')?.focus();
            return false;
        }
        
        if (!tournamentPhase || tournamentPhase === '') {
            showAlert('Harap isi Fase Turnamen terlebih dahulu!', 'error');
            document.getElementById('tournamentPhase')?.focus();
            return false;
        }
        
        return true;
    }
    
    // Download Certificate 1 Button
    if (downloadCertificate1Btn) {
        downloadCertificate1Btn.addEventListener('click', function() {
            // Validate tournament info first
            if (!validateTournamentInfo()) {
                return;
            }
            
            showAdModal();
            const { winner1 } = getWinnersData();
            const tournamentName = document.getElementById('tournamentName')?.value.trim();
            const tournamentPhase = document.getElementById('tournamentPhase')?.value.trim();
            
            if (!winner1 || winner1.points.total === 0) {
                showAlert('Tidak ada data juara 1!', 'error');
                return;
            }
            
            generateHorizontalCertificate(winner1, 1, 'Juara Pertama', '#fbbf24', tournamentName, tournamentPhase);
        });
    }
    
    // Download Certificate 2 Button
    if (downloadCertificate2Btn) {
        downloadCertificate2Btn.addEventListener('click', function() {
            // Validate tournament info first
            if (!validateTournamentInfo()) {
                return;
            }
            
            showAdModal();
            const { winner2 } = getWinnersData();
            const tournamentName = document.getElementById('tournamentName')?.value.trim();
            const tournamentPhase = document.getElementById('tournamentPhase')?.value.trim();
            
            if (!winner2 || winner2.points.total === 0) {
                showAlert('Tidak ada data juara 2!', 'error');
                return;
            }
            
            generateHorizontalCertificate(winner2, 2, 'Juara Kedua', '#94a3b8', tournamentName, tournamentPhase);
        });
    }
    
    // Download Certificate 3 Button
    if (downloadCertificate3Btn) {
        downloadCertificate3Btn.addEventListener('click', function() {
            // Validate tournament info first
            if (!validateTournamentInfo()) {
                return;
            }
            
            showAdModal();
            const { winner3 } = getWinnersData();
            const tournamentName = document.getElementById('tournamentName')?.value.trim();
            const tournamentPhase = document.getElementById('tournamentPhase')?.value.trim();
            
            if (!winner3 || winner3.points.total === 0) {
                showAlert('Tidak ada data juara 3!', 'error');
                return;
            }
            
            generateHorizontalCertificate(winner3, 3, 'Juara Ketiga', '#d97706', tournamentName, tournamentPhase);
        });
    }
    
    // Download Certificate Most Kill Button
    if (downloadCertificateKillBtn) {
        downloadCertificateKillBtn.addEventListener('click', function() {
            // Validate tournament info first
            if (!validateTournamentInfo()) {
                return;
            }
            
            showAdModal();
            const { mostKillTeam } = getWinnersData();
            const tournamentName = document.getElementById('tournamentName')?.value.trim();
            const tournamentPhase = document.getElementById('tournamentPhase')?.value.trim();
            
            if (!mostKillTeam || (mostKillTeam.match1.kills + mostKillTeam.match2.kills) === 0) {
                showAlert('Tidak ada data most kill team!', 'error');
                return;
            }
            
            generateHorizontalCertificate(mostKillTeam, 0, 'Most Kill Team', '#ef4444', tournamentName, tournamentPhase, true);
        });
    }
    
    
    // Initialize certificate button state and preview
    setTimeout(() => {
        updateCertificateButtonState();
    }, 500);

    // Load saved data
    async function loadSavedData() {
        try {
            const savedData = await loadFromIndexedDB();
            if (savedData) {
                // Check if data has new structure with tournament info
                if (savedData.teamsData) {
                    // New structure
                    teamsData = savedData.teamsData;
                    
                    // Load tournament info
                    const tournamentNameField = document.getElementById('tournamentName');
                    const tournamentPhaseField = document.getElementById('tournamentPhase');
                    
                    if (tournamentNameField && savedData.tournamentName) {
                        tournamentNameField.value = savedData.tournamentName;
                    }
                    if (tournamentPhaseField && savedData.tournamentPhase) {
                        tournamentPhaseField.value = savedData.tournamentPhase;
                    }
                } else {
                    // Old structure (just teams data)
                    teamsData = savedData;
                }
                
                generateInputTable();
                generateResultsTable();
                generateKillStats();
                showAlert('Data turnamen berhasil dimuat!', 'info');
            } else {
                initializeTeamsData();
            }
        } catch (error) {
            // Fallback to localStorage for backward compatibility
            const localData = localStorage.getItem('ffTournamentData');
            if (localData) {
                try {
                    teamsData = JSON.parse(localData);
                    generateInputTable();
                    generateResultsTable();
                    generateKillStats();
                    // Migrate to IndexedDB
                    await saveToIndexedDB(teamsData);
                    localStorage.removeItem('ffTournamentData'); // Clean up old data
                } catch (e) {
                    initializeTeamsData();
                }
            } else {
                initializeTeamsData();
            }
        }
    }

    // Initialize calculator
    async function initializeCalculator() {
        if (inputTableBody && resultsTableBody) {
            try {
                await initDB();
                initializeTeamsData();
                generateInputTable();
                generateResultsTable();
                await loadSavedData();
            } catch (error) {
                showAlert('Terjadi kesalahan saat memuat kalkulator.', 'error');
                // Fallback initialization
                initializeTeamsData();
                generateInputTable();
                generateResultsTable();
            }
        }
    }





    // Make initializeCalculator globally available
    window.initializeCalculator = initializeCalculator;

    // Start the calculator
    initializeCalculator().then(() => {
        // Calculator initialized successfully
    }).catch(error => {
        // Still assign global functions as fallback
        if (typeof assignGlobalFunctions === 'function') {
            assignGlobalFunctions();
        }
    });

    // Fallback initialization after 2 seconds
    setTimeout(() => {
        const inputTableBody = document.getElementById('inputTableBody');
        if (inputTableBody && inputTableBody.children.length <= 1) {
            initializeCalculator();
        }
    }, 2000);

    // Only run old calculator functionality if elements exist
    if (killInput && placementInput && calculateBtn) {

    // Calculate button click handler
    calculateBtn.addEventListener('click', function() {
        const killCount = parseInt(killInput.value) || 0;
        const placementRank = parseInt(placementInput.value);

        // Validation
        if (killCount < 0 || killCount > 50) {
            showError('Jumlah kill harus antara 0-50');
            return;
        }

        if (!placementRank || placementRank < 1 || placementRank > 12) {
            showError('Pilih ranking placement yang valid');
            return;
        }

        // Calculate points
        const killPoints = killCount; // 1 kill = 1 point
        const placementPts = placementPoints[placementRank];
        const totalPoints = killPoints + placementPts;

        // Show loading animation
        showLoading();

        // Simulate calculation delay for better UX
        setTimeout(() => {
            displayResults(killPoints, placementPts, totalPoints);
        }, 800);
    });

    // Input validation and real-time feedback
    killInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value < 0) this.value = 0;
        if (value > 50) this.value = 50;
        
        // Clear results if inputs change
        if (resultSection && !resultSection.classList.contains('hidden')) {
            clearResults();
        }
    });

    placementInput.addEventListener('change', function() {
        // Clear results if inputs change
        if (resultSection && !resultSection.classList.contains('hidden')) {
            clearResults();
        }
    });

    // Enter key support
    killInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    placementInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    // Functions
    function showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 text-red-400 text-center';
            calculateBtn.parentNode.insertBefore(errorDiv, calculateBtn.nextSibling);
        }
        
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle mr-2"></i>
            ${message}
        `;
        
        // Auto-hide error after 3 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.remove();
            }
        }, 3000);
    }

    function showLoading() {
        const originalText = calculateBtn.innerHTML;
        calculateBtn.innerHTML = `
            <i class="fas fa-spinner loading-spinner mr-2"></i>
            Menghitung...
        `;
        calculateBtn.disabled = true;
        
        // Store original text for restoration
        calculateBtn.dataset.originalText = originalText;
    }

    function displayResults(killPts, placementPts, totalPts) {
        // Restore button
        calculateBtn.innerHTML = calculateBtn.dataset.originalText;
        calculateBtn.disabled = false;
        
        // Remove error message if exists
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        // Hide placeholder and show results
        placeholderSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        resultSection.classList.add('result-animation');
        
        // Animate numbers counting up
        animateNumber(killPointsDisplay, killPts);
        animateNumber(placementPointsDisplay, placementPts);
        animateNumber(totalPointsDisplay, totalPts);
        
        // Add bounce animation to total points
        setTimeout(() => {
            totalPointsDisplay.parentElement.parentElement.classList.add('bounce-in');
        }, 500);
        
        // Scroll to results on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                resultSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 600);
        }
    }

    function clearResults() {
        placeholderSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
        resultSection.classList.remove('result-animation');
        
        // Reset displays
        killPointsDisplay.textContent = '0';
        placementPointsDisplay.textContent = '0';
        totalPointsDisplay.textContent = '0';
    }

    function animateNumber(element, targetNumber) {
        const startNumber = 0;
        const duration = 1000; // 1 second
        const steps = 50;
        const stepValue = targetNumber / steps;
        const stepDuration = duration / steps;
        
        let currentNumber = startNumber;
        const interval = setInterval(() => {
            currentNumber += stepValue;
            if (currentNumber >= targetNumber) {
                element.textContent = targetNumber;
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(currentNumber);
            }
        }, stepDuration);
    }

    // Add visual feedback for form interactions
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('scale-105');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('scale-105');
        });
    });

    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateBtn.click();
        }
        
        // Escape to clear results
        if (e.key === 'Escape') {
            clearResults();
            killInput.value = '';
            placementInput.value = '';
            killInput.focus();
        }
    });

    // Auto-focus on kill input when page loads
    setTimeout(() => {
        killInput.focus();
    }, 500);

    // Add tooltips for better UX
    const addTooltip = (element, text) => {
        element.setAttribute('title', text);
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'fixed bg-gray-800 text-white px-2 py-1 rounded text-sm z-50 pointer-events-none';
            tooltip.textContent = text;
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 30 + 'px';
            tooltip.id = 'tooltip';
            document.body.appendChild(tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) tooltip.remove();
        });
    };

    // Add tooltips to form elements
    addTooltip(killInput, 'Masukkan jumlah kill yang didapat (0-50)');
    addTooltip(placementInput, 'Pilih ranking akhir tim Anda');
    addTooltip(calculateBtn, 'Klik untuk menghitung total poin (Ctrl+Enter)');

    // Performance optimization: Debounce input events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounced input validation
    const debouncedValidation = debounce(() => {
        const killCount = parseInt(killInput.value) || 0;
        const placementRank = parseInt(placementInput.value);
        
        // Enable/disable calculate button based on input validity
        if (killCount >= 0 && killCount <= 50 && placementRank >= 1 && placementRank <= 12) {
            calculateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            calculateBtn.disabled = false;
        } else {
            calculateBtn.classList.add('opacity-50', 'cursor-not-allowed');
            calculateBtn.disabled = true;
        }
    }, 300);

    killInput.addEventListener('input', debouncedValidation);
    placementInput.addEventListener('change', debouncedValidation);

    // Initialize button state
    debouncedValidation();

    // Add success sound effect (optional - can be enabled later)
    function playSuccessSound() {
        // Create audio context for success sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const AudioContextClass = AudioContext || webkitAudioContext;
            const audioContext = new AudioContextClass();
            
            // Create a simple success tone
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }

    // Enhanced visual feedback
    function addPulseEffect(element) {
        element.classList.add('pulse-animation');
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, 2000);
    }

    // Local storage for user preferences (optional feature)
    function saveToHistory(killPoints, placementPoints, totalPoints) {
        const calculation = {
            killPoints,
            placementPoints,
            totalPoints,
            timestamp: new Date().toISOString()
        };
        
        let history = JSON.parse(localStorage.getItem('ffCalculatorHistory') || '[]');
        history.unshift(calculation);
        
        // Keep only last 10 calculations
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('ffCalculatorHistory', JSON.stringify(history));
    }

    // Add to displayResults function
    const originalDisplayResults = displayResults;
    displayResults = function(killPts, placementPts, totalPts) {
        originalDisplayResults(killPts, placementPts, totalPts);
        
        // Save to history
        saveToHistory(killPts, placementPts, totalPts);
        
        // Add pulse effect to total points
        addPulseEffect(totalPointsDisplay.parentElement.parentElement);
        
        // Optional: Play success sound
        // playSuccessSound();
    };

    } // End of calculator functionality block

    // Support Modal Functions (Always run regardless of calculator elements)
    function showSupportModal() {
        const modal = document.getElementById('supportModal');
        const modalContent = document.getElementById('modalContent');
        const mainContent = document.getElementById('mainContent');
        
        if (modal && modalContent && mainContent) {
            modal.classList.remove('hidden');
            mainContent.classList.add('blur-active');
            
            // Trigger animation after a small delay
            setTimeout(() => {
                modal.classList.add('show');
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }, 10);
        }
    }

    // Check if modal should be shown on page load
    function checkShowModal() {
        const dontShowAgain = localStorage.getItem('ffpoint_dont_show_support_modal');
        
        // Don't show if user clicked "don't show again"
        if (dontShowAgain === 'true') {
            return;
        }
        
        // Always show modal after 3 seconds on every visit
        setTimeout(() => {
            showSupportModal();
        }, 3000); // Show after 3 seconds
    }

    // Initialize modal check
    checkShowModal();

});

// Global Modal Control Functions
function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    const modalContent = document.getElementById('modalContent');
    const mainContent = document.getElementById('mainContent');
    
    if (modal && modalContent && mainContent) {
        modal.classList.remove('show');
        modalContent.style.transform = 'scale(0.95)';
        modalContent.style.opacity = '0';
        mainContent.classList.remove('blur-active');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

function dontShowAgain() {
    localStorage.setItem('ffpoint_dont_show_support_modal', 'true');
    closeSupportModal();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('supportModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent && event.target === modal) {
        closeSupportModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSupportModal();
    }
});

// Export functions for potential external use
window.FFCalculator = {
    calculate: function(kills, placement) {
        const placementPoints = {
            1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5,
            7: 4, 8: 3, 9: 2, 10: 1, 11: 0, 12: 0
        };
        
        return {
            killPoints: kills,
            placementPoints: placementPoints[placement] || 0,
            totalPoints: kills + (placementPoints[placement] || 0)
        };
    }
};

// Reset Modal Functions
function showResetModal() {
    const resetModal = document.getElementById('resetModal');
    const resetModalContent = document.getElementById('resetModalContent');
    const mainContent = document.getElementById('mainContent');
    
    if (resetModal && resetModalContent) {
        resetModal.classList.remove('hidden');
        mainContent.classList.add('blur-active');
        
        // Trigger animation
        setTimeout(() => {
            resetModal.classList.add('show');
            resetModalContent.style.transform = 'scale(1)';
            resetModalContent.style.opacity = '1';
        }, 10);
    }
}

function closeResetModal() {
    const resetModal = document.getElementById('resetModal');
    const resetModalContent = document.getElementById('resetModalContent');
    const mainContent = document.getElementById('mainContent');
    
    if (resetModal && resetModalContent) {
        resetModal.classList.remove('show');
        resetModalContent.style.transform = 'scale(0.95)';
        resetModalContent.style.opacity = '0';
        mainContent.classList.remove('blur-active');
        
        setTimeout(() => {
            resetModal.classList.add('hidden');
        }, 300);
    }





}

// Global Reset Function
function performReset() {
    // Get DOM elements
    const inputTableBody = document.getElementById('inputTableBody');
    const resultsTableBody = document.getElementById('resultsTableBody');
    const killStatsSection = document.getElementById('killStatsSection');
    const tournamentName = document.getElementById('tournamentName');
    const tournamentPhase = document.getElementById('tournamentPhase');
    
    // Clear tournament info
    if (tournamentName) tournamentName.value = '';
    if (tournamentPhase) tournamentPhase.value = '';
    
    // Reset teams data structure
    const resetTeamsData = [];
    for (let i = 1; i <= 12; i++) {
        resetTeamsData.push({
            id: i,
            name: `Team ${i}`,
            match1: { rank: 0, kills: 0 },
            match2: { rank: 0, kills: 0 },
            totalPoints: 0
        });
    }
    
    // Clear input table and regenerate
    if (inputTableBody) {
        inputTableBody.innerHTML = '';
        resetTeamsData.forEach((team, index) => {
            const row = document.createElement('tr');
            row.className = 'bg-slate-800/20 hover:bg-slate-700/30 transition-all duration-300';
            
            row.innerHTML = `
                <td class="px-3 py-3">
                    <input type="text" 
                           value="${team.name}" 
                           class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                           onchange="updateTeamName(${index}, this.value)">
                </td>
                <td class="px-2 py-3">
                    <select class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                            onchange="updateTeamData(${index}, 'match1', 'rank', parseInt(this.value))">
                        <option value="0">-</option>
                        ${generateRankOptions(team.match1.rank)}
                    </select>
                </td>
                <td class="px-2 py-3">
                    <input type="number" 
                           min="0" max="50" 
                           value="${team.match1.kills}" 
                           class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                           onchange="updateTeamData(${index}, 'match1', 'kills', parseInt(this.value) || 0)">
                </td>
                <td class="px-2 py-3">
                    <select class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                            onchange="updateTeamData(${index}, 'match2', 'rank', parseInt(this.value))">
                        <option value="0">-</option>
                        ${generateRankOptions(team.match2.rank)}
                    </select>
                </td>
                <td class="px-2 py-3">
                    <input type="number" 
                           min="0" max="50" 
                           value="${team.match2.kills}" 
                           class="w-full bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1 text-slate-200 text-sm focus:border-yellow-400 focus:outline-none"
                           onchange="updateTeamData(${index}, 'match2', 'kills', parseInt(this.value) || 0)">
                </td>
            `;
            
            inputTableBody.appendChild(row);
        });
    }
    
    // Clear results table - show empty 12 rows
    if (resultsTableBody) {
        resultsTableBody.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const row = document.createElement('tr');
            row.className = 'bg-slate-800/20 hover:bg-slate-700/30 transition-all duration-300';
            const rankDisplay = i + 1;
            
            row.innerHTML = `
                <td class="px-3 py-3 text-center">
                    <span class="font-gaming font-bold text-slate-500">#${rankDisplay}</span>
                </td>
                <td class="px-3 py-3 text-center">
                    <span class="font-medium text-slate-500">-</span>
                </td>
                <td class="px-2 py-3 text-center">
                    <span class="text-slate-500">0</span>
                </td>
                <td class="px-2 py-3 text-center">
                    <span class="text-slate-500">0</span>
                </td>
                <td class="px-3 py-3 text-center">
                    <span class="font-bold text-lg text-slate-500">0</span>
                </td>
            `;
            
            resultsTableBody.appendChild(row);
        }
    }
    
    // Hide kill stats
    if (killStatsSection) {
        killStatsSection.classList.add('hidden');
    }
    
    // Clear IndexedDB
    try {
        const request = indexedDB.open('FFPointCalculator', 1);
        request.onsuccess = function(event) {
            const db = event.target.result;
            if (db.objectStoreNames.contains('tournamentData')) {
                const transaction = db.transaction(['tournamentData'], 'readwrite');
                const store = transaction.objectStore('tournamentData');
                store.clear();
            }
        };
        request.onerror = function() {
            // Error opening IndexedDB for clearing
        };
    } catch (error) {
        // Error clearing IndexedDB
    }
    
    // Close modal
    closeResetModal();
    
    // Show success alert
    const alertContainer = document.querySelector('.alert-container') || (() => {
        const container = document.createElement('div');
        container.className = 'alert-container';
        document.body.appendChild(container);
        return container;
    })();
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        🔥 Semua data berhasil direset! Siap untuk turnamen baru.
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Helper function for generating rank options
function generateRankOptions(selectedRank) {
    let options = '';
    for (let i = 1; i <= 12; i++) {
        const selected = i === selectedRank ? 'selected' : '';
        options += `<option value="${i}" ${selected}>#${i}</option>`;
    }
    return options;
}

// FAQ Toggle Function
function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon i');
    const isOpen = !answer.classList.contains('hidden');
    
    if (isOpen) {
        answer.classList.add('hidden');
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
        icon.style.transform = 'rotate(0deg)';
    } else {
        answer.classList.remove('hidden');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
        icon.style.transform = 'rotate(180deg)';
    }
}

// Make toggleFAQ globally available
window.toggleFAQ = toggleFAQ;

// Debug and Force Initialize Script
document.addEventListener('DOMContentLoaded', function() {
    const inputTableBody = document.getElementById('inputTableBody');
    const resultsTableBody = document.getElementById('resultsTableBody');
    
    // Force initialize if elements exist but table is empty
    if (inputTableBody && inputTableBody.children.length <= 1) {
        setTimeout(() => {
            if (typeof initializeCalculator === 'function') {
                initializeCalculator();
            }
        }, 1000);
    }
});
