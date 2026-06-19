// ShowView App Logic

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE ---
  let theaters = JSON.parse(localStorage.getItem("THEATER_DATA"));
  let reviews = JSON.parse(localStorage.getItem("SEEYA_REVIEWS")) || {};
  let loggedInUser = JSON.parse(localStorage.getItem("LOGGED_IN_USER"));

  let activeView = "home"; // 'home', 'theater', 'compare'
  let selectedTheater = null;
  let selectedFloorLevel = 1;
  let selectedSeat = null;
  let overlayMode = "tier"; // 'tier', 'rating'
  let compareMode = false;
  let compareList = []; // Array of seat IDs (max 3)

  let tempUploadedImageBase64 = "";
  let tempStarRating = 0;

  // --- DOM ELEMENTS ---
  const homeView = document.getElementById("home-view");
  const theaterView = document.getElementById("theater-view");
  const compareView = document.getElementById("compare-view");

  const logoBtn = document.getElementById("logo-btn");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const theaterList = document.getElementById("theater-list");

  // Theater Details
  const backToHomeBtn = document.getElementById("back-to-home");
  const detailShowName = document.getElementById("detail-show-name");
  const detailTheaterName = document.getElementById("detail-theater-name");
  const detailLocation = document.getElementById("detail-location");
  const floorTabContainer = document.getElementById("floor-tab-container");
  const overlayModeSelect = document.getElementById("overlay-mode-select");
  const compareModeCheckbox = document.getElementById("compare-mode-checkbox");
  const seatingChartContainer = document.getElementById("seating-chart-container");
  const mapLegendContainer = document.getElementById("map-legend-container");

  // Seat Sidebar Panel
  const panelEmptyState = document.getElementById("panel-empty-state");
  const panelActiveState = document.getElementById("panel-active-state");
  const detailSeatTitle = document.getElementById("detail-seat-title");
  const detailSeatTier = document.getElementById("detail-seat-tier");
  const detailStars = document.getElementById("detail-stars");
  const detailRatingNum = document.getElementById("detail-rating-num");
  const detailReviewCount = document.getElementById("detail-review-count");
  const detailViewImg = document.getElementById("detail-view-img");
  const detailCommentsList = document.getElementById("detail-comments-list");
  const addReviewTriggerBtn = document.getElementById("add-review-trigger-btn");

  // Compare Layout
  const backToTheaterMapBtn = document.getElementById("back-to-theater-map");
  const compareTheaterSubtitle = document.getElementById("compare-theater-subtitle");
  const compareColumnsWrapper = document.getElementById("compare-columns-wrapper");
  const compareActionBar = document.getElementById("compare-action-bar");
  const compareSelectedCount = document.getElementById("compare-selected-count");
  const compareCancelBtn = document.getElementById("compare-cancel-btn");
  const compareSubmitBtn = document.getElementById("compare-submit-btn");

  // Modals & Forms
  const navLoginBtn = document.getElementById("nav-login-btn");
  const navLogoutBtn = document.getElementById("nav-logout-btn");
  const userProfileInfo = document.getElementById("user-profile-info");
  
  const loginModal = document.getElementById("login-modal");
  const loginModalClose = document.getElementById("login-modal-close");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username-input");

  const reviewModal = document.getElementById("review-modal");
  const reviewModalTitle = document.getElementById("review-modal-title");
  const reviewModalClose = document.getElementById("review-modal-close");
  const reviewForm = document.getElementById("review-form");
  const starRatingInput = document.getElementById("star-rating-input");
  const reviewRatingVal = document.getElementById("review-rating-val");
  const reviewCommentInput = document.getElementById("review-comment-input");
  const reviewFileInput = document.getElementById("review-file-input");
  const fileDropArea = document.getElementById("file-drop-area");
  const uploadPreviewBox = document.getElementById("upload-preview-box");
  const uploadPreviewImg = document.getElementById("upload-preview-img");

  const photoViewerModal = document.getElementById("photo-viewer-modal");
  const photoViewerClose = document.getElementById("photo-viewer-close");
  const lightboxImageImg = document.getElementById("lightbox-image-img");

  // --- ROUTING / VIEW CHANGING ---
  function switchView(targetView) {
    activeView = targetView;
    homeView.classList.remove("active");
    theaterView.classList.remove("active");
    compareView.classList.remove("active");

    if (targetView === "home") {
      homeView.classList.add("active");
      renderTheaterList();
    } else if (targetView === "theater") {
      theaterView.classList.add("active");
      renderSeatMap();
      renderSeatDetail(selectedSeat);
    } else if (targetView === "compare") {
      compareView.classList.add("active");
      renderCompareView();
    }
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- USER AUTH MANAGEMENT ---
  function updateAuthUI() {
    if (loggedInUser) {
      navLoginBtn.style.display = "none";
      navLogoutBtn.style.display = "inline-flex";
      userProfileInfo.textContent = `${loggedInUser} 님`;
      userProfileInfo.style.display = "inline";
    } else {
      navLoginBtn.style.display = "inline-flex";
      navLogoutBtn.style.display = "none";
      userProfileInfo.style.display = "none";
    }
  }

  navLoginBtn.addEventListener("click", () => {
    loginModal.classList.add("active");
    usernameInput.focus();
  });

  loginModalClose.addEventListener("click", () => {
    loginModal.classList.remove("active");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
      loggedInUser = username;
      localStorage.setItem("LOGGED_IN_USER", JSON.stringify(loggedInUser));
      updateAuthUI();
      loginModal.classList.remove("active");
      usernameInput.value = "";
    }
  });

  navLogoutBtn.addEventListener("click", () => {
    loggedInUser = null;
    localStorage.setItem("LOGGED_IN_USER", JSON.stringify(null));
    updateAuthUI();
  });

  // --- HOME VIEW: THEATER LIST & SEARCH ---
  function renderTheaterList(filterText = "") {
    theaterList.innerHTML = "";
    const term = filterText.toLowerCase().trim();

    const filtered = theaters.filter(t => 
      t.name.toLowerCase().includes(term) || 
      t.currentShow.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
      theaterList.innerHTML = `
        <div class="login-message" style="grid-column: 1 / -1; font-size: 1.1rem; padding: 3rem;">
          검색 결과에 맞는 극장이나 공연이 없습니다. 다른 이름으로 검색해 보세요!
        </div>`;
      return;
    }

    filtered.forEach(theater => {
      const card = document.createElement("div");
      card.className = "theater-card glass-panel";
      
      // Calculate show status Badge
      card.innerHTML = `
        <div class="theater-card-banner" style="background-image: url('${theater.bannerImage}');">
          <span class="show-badge">공연중</span>
        </div>
        <div class="theater-card-content">
          <div class="theater-info">
            <h3>${theater.name}</h3>
            <div class="location">${theater.location}</div>
            <div class="show-title">${theater.currentShow}</div>
            <div class="desc">${theater.description}</div>
          </div>
          <div class="theater-footer">
            <div class="seat-count">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${theater.totalSeats}</span>
            </div>
            <span class="view-link">
              배치도 보기 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        selectedTheater = theater;
        selectedFloorLevel = 1;
        selectedSeat = null;
        compareMode = false;
        compareList = [];
        compareModeCheckbox.checked = false;
        compareActionBar.classList.remove("active");
        
        // Update header details
        detailTheaterName.textContent = theater.name;
        detailShowName.textContent = theater.currentShow;
        detailLocation.textContent = theater.location;

        // Build Floor Tabs
        renderFloorTabs();
        switchView("theater");
      });

      theaterList.appendChild(card);
    });
  }

  searchBtn.addEventListener("click", () => {
    renderTheaterList(searchInput.value);
  });

  searchInput.addEventListener("keyup", (e) => {
    renderTheaterList(searchInput.value);
  });

  // --- THEATER DETAIL: FLOOR TABS & INTERACTIVE SEAT MAP ---
  function renderFloorTabs() {
    floorTabContainer.innerHTML = "";
    selectedTheater.floors.forEach(floor => {
      const tab = document.createElement("button");
      tab.className = `tab-btn ${floor.level === selectedFloorLevel ? "active" : ""}`;
      tab.textContent = `${floor.level}층`;
      
      tab.addEventListener("click", () => {
        selectedFloorLevel = floor.level;
        // Keep selectedSeat if it belongs to the same floor, otherwise clear
        if (selectedSeat && !selectedSeat.startsWith(`${selectedTheater.id}-${selectedFloorLevel}-`)) {
          selectedSeat = null;
        }
        
        // Remove active class from other tabs
        floorTabContainer.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        tab.classList.add("active");
        
        renderSeatMap();
        renderSeatDetail(selectedSeat);
      });
      
      floorTabContainer.appendChild(tab);
    });
  }

  // Row Index to Character Conversion Helper
  const getRowName = (index) => String.fromCharCode(65 + index);

  function getSeatRatingStats(seatId, defaultClass) {
    const seatReviews = reviews[seatId];
    if (!seatReviews || seatReviews.length === 0) {
      return { average: null, count: 0, rounded: null };
    }
    const sum = seatReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = parseFloat((sum / seatReviews.length).toFixed(1));
    const rounded = Math.round(average); // 1 to 5 stars
    return { average, count: seatReviews.length, rounded };
  }

  function getSeatDefaultPhoto(seatClass, zoneId) {
    // Return appropriate seat visual photo
    const isObstructedZone = zoneId.endsWith("-L") || zoneId.endsWith("-R");
    if (isObstructedZone && seatClass !== "VIP") {
      return "view_obstructed.png";
    }
    
    switch (seatClass) {
      case "VIP": return "view_vip.png";
      case "R": return "view_r.png";
      case "S": return "view_s.png";
      case "A": return "view_s.png";
      default: return "view_r.png";
    }
  }

  function renderSeatMap() {
    seatingChartContainer.innerHTML = "";
    renderLegends();

    const floorData = selectedTheater.floors.find(f => f.level === selectedFloorLevel);
    if (!floorData) return;

    floorData.zones.forEach(zone => {
      const zoneCol = document.createElement("div");
      zoneCol.className = "seating-zone";
      
      const zoneTitle = document.createElement("div");
      zoneTitle.className = "zone-title";
      zoneTitle.textContent = zone.name;
      zoneCol.appendChild(zoneTitle);

      // Render seating rows
      for (let r = 0; r < zone.rows; r++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        // Row character label on left side of center zone, or on extreme sides
        const rowLabel = document.createElement("span");
        rowLabel.className = "row-label";
        rowLabel.textContent = getRowName(r);
        rowDiv.appendChild(rowLabel);

        // Render seats
        for (let s = 1; s <= zone.seatsPerRow; s++) {
          const seatSpan = document.createElement("span");
          const seatId = `${selectedTheater.id}-${selectedFloorLevel}-${zone.id}-${r+1}-${s}`;
          
          seatSpan.className = "seat";
          seatSpan.textContent = s;
          seatSpan.dataset.seatId = seatId;
          seatSpan.title = `${getRowName(r)}열 ${s}번`;

          // Determine seat class (VIP/R/S/A)
          let seatClass = zone.defaultClass;
          // Subdivide classes for realistic layout (e.g., front rows of Center are VIP, back rows S)
          if (zone.id.endsWith("-C")) {
            if (r < 4) seatClass = "VIP";
            else if (r < 8) seatClass = "R";
            else seatClass = "S";
          } else { // Left/Right side zones
            if (r < 5) seatClass = "R";
            else if (r < 8) seatClass = "S";
            else seatClass = "A";
          }

          seatSpan.dataset.seatClass = seatClass;

          // Apply overlay class based on setting
          const ratingStats = getSeatRatingStats(seatId, seatClass);
          if (overlayMode === "tier") {
            seatSpan.classList.add(`tier-${seatClass.toLowerCase()}`);
          } else if (overlayMode === "rating") {
            if (ratingStats.average) {
              seatSpan.classList.add(`rating-${ratingStats.rounded}`);
            } else {
              seatSpan.classList.add("rating-none");
            }
          }

          // Active states
          if (selectedSeat === seatId) {
            seatSpan.classList.add("selected");
          }
          if (compareList.includes(seatId)) {
            seatSpan.classList.add("compare-selected");
          }

          // Click handler
          seatSpan.addEventListener("click", () => {
            handleSeatClick(seatId, seatClass, zone.id, r+1, s);
          });

          rowDiv.appendChild(seatSpan);
        }
        
        zoneCol.appendChild(rowDiv);
      }

      seatingChartContainer.appendChild(zoneCol);
    });
  }

  function renderLegends() {
    mapLegendContainer.innerHTML = "";
    let legends = [];

    if (overlayMode === "tier") {
      legends = [
        { name: "VIP석", color: "var(--tier-vip)" },
        { name: "R석", color: "var(--tier-r)" },
        { name: "S석", color: "var(--tier-s)" },
        { name: "A석", color: "var(--tier-a)" }
      ];
    } else {
      legends = [
        { name: "매우 만족 (5점)", color: "var(--rating-5)" },
        { name: "만족 (4점)", color: "var(--rating-4)" },
        { name: "보통 (3점)", color: "var(--rating-3)" },
        { name: "아쉬움 (2점)", color: "var(--rating-2)" },
        { name: "매우 아쉬움 (1점)", color: "var(--rating-1)" },
        { name: "리뷰 없음", color: "var(--rating-none)" }
      ];
    }

    legends.forEach(item => {
      const leg = document.createElement("div");
      leg.className = "legend-item";
      leg.innerHTML = `
        <span class="legend-color" style="background-color: ${item.color};"></span>
        <span>${item.name}</span>
      `;
      mapLegendContainer.appendChild(leg);
    });
  }

  function handleSeatClick(seatId, seatClass, zoneId, row, seatNum) {
    if (compareMode) {
      // Comparison Mode Logic
      if (compareList.includes(seatId)) {
        // Remove from list
        compareList = compareList.filter(id => id !== seatId);
      } else {
        // Add to list
        if (compareList.length >= 3) {
          alert("좌석 비교는 최대 3개까지만 가능합니다.");
          return;
        }
        compareList.push(seatId);
      }
      
      // Update action bar UI
      compareSelectedCount.textContent = `선택한 좌석: ${compareList.length} / 3`;
      compareSubmitBtn.disabled = compareList.length < 2;

      // Re-render map to reflect dotted highlight
      renderSeatMap();
    } else {
      // Normal Mode: Show detail sidebar
      selectedSeat = seatId;
      renderSeatMap(); // Update solid highlights
      renderSeatDetail(seatId);
    }
  }

  // --- SEAT DETAIL SIDEBAR RENDER ---
  function renderSeatDetail(seatId) {
    if (!seatId) {
      panelEmptyState.style.display = "flex";
      panelActiveState.style.display = "none";
      return;
    }

    panelEmptyState.style.display = "none";
    panelActiveState.style.display = "flex";

    // Deconstruct seatId: "charlotte-1-1F-C-3-6" -> charlotte, floor 1, zone 1F-C, row 3, seat 6
    const parts = seatId.split("-");
    const floor = parts[1];
    const zoneId = parts[2];
    const row = parts[3];
    const seatNum = parts[4];
    
    // Find zone name
    const floorObj = selectedTheater.floors.find(f => f.level == floor);
    const zoneObj = floorObj ? floorObj.zones.find(z => z.id === zoneId) : null;
    const zoneName = zoneObj ? zoneObj.name : zoneId;

    // Display basic info
    const seatLabel = `${floor}층 ${zoneName} ${getRowName(row - 1)}열 ${seatNum}번`;
    detailSeatTitle.textContent = seatLabel;
    
    const seatClass = document.querySelector(`.seat[data-seat-id="${seatId}"]`)?.dataset.seatClass || "R";
    detailSeatTier.textContent = `${seatClass}석`;

    // Fetch Reviews & Photos
    const seatReviews = reviews[seatId] || [];
    const ratingStats = getSeatRatingStats(seatId, seatClass);

    if (seatReviews.length > 0) {
      detailStars.textContent = "★".repeat(ratingStats.rounded) + "☆".repeat(5 - ratingStats.rounded);
      detailRatingNum.textContent = ratingStats.average;
      detailReviewCount.textContent = `(리뷰 ${seatReviews.length}개)`;
      
      // Set image to the latest review image
      const latestReviewWithImg = [...seatReviews].reverse().find(r => r.image);
      detailViewImg.src = latestReviewWithImg ? latestReviewWithImg.image : getSeatDefaultPhoto(seatClass, zoneId);
    } else {
      detailStars.textContent = "☆☆☆☆☆";
      detailRatingNum.textContent = "-";
      detailReviewCount.textContent = `(리뷰 0개)`;
      detailViewImg.src = getSeatDefaultPhoto(seatClass, zoneId);
    }

    // Render Review Comments
    detailCommentsList.innerHTML = "";
    if (seatReviews.length === 0) {
      detailCommentsList.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--text-dim); text-align: center; padding: 1.5rem 0;">
          작성된 리뷰가 없습니다.<br>첫 번째로 실제 시야 리뷰를 등록해 보세요!
        </div>`;
    } else {
      // Sort reviews latest first
      [...seatReviews].reverse().forEach(rev => {
        const revCard = document.createElement("div");
        revCard.className = "comment-card";
        revCard.innerHTML = `
          <div class="comment-meta">
            <span class="comment-author">${rev.user}</span>
            <span>${rev.date}</span>
          </div>
          <div style="color: #fbbf24; font-size: 0.75rem; margin-bottom: 0.25rem;">${"★".repeat(rev.rating)}</div>
          <p class="comment-content">${rev.content}</p>
        `;
        detailCommentsList.appendChild(revCard);
      });
    }
  }

  // --- COMPARE VIEW PAGE: SPLIT COLUMNS ---
  function renderCompareView() {
    compareColumnsWrapper.innerHTML = "";
    compareTheaterSubtitle.textContent = `${selectedTheater.name} - ${selectedTheater.currentShow}`;

    compareList.forEach(seatId => {
      const parts = seatId.split("-");
      const floor = parts[1];
      const zoneId = parts[2];
      const row = parts[3];
      const seatNum = parts[4];

      const floorObj = selectedTheater.floors.find(f => f.level == floor);
      const zoneObj = floorObj ? floorObj.zones.find(z => z.id === zoneId) : null;
      const zoneName = zoneObj ? zoneObj.name : zoneId;
      const seatClass = document.querySelector(`.seat[data-seat-id="${seatId}"]`)?.dataset.seatClass || "R";

      const seatReviews = reviews[seatId] || [];
      const ratingStats = getSeatRatingStats(seatId, seatClass);
      
      const avgRatingText = ratingStats.average ? `${ratingStats.average} / 5.0` : "리뷰 없음";
      const starsHtml = ratingStats.average ? "★".repeat(ratingStats.rounded) + "☆".repeat(5 - ratingStats.rounded) : "☆☆☆☆☆";
      
      // Determine Image
      let viewImgUrl = getSeatDefaultPhoto(seatClass, zoneId);
      if (seatReviews.length > 0) {
        const latestReviewWithImg = [...seatReviews].reverse().find(r => r.image);
        if (latestReviewWithImg) viewImgUrl = latestReviewWithImg.image;
      }

      // Generate column UI
      const column = document.createElement("div");
      column.className = "compare-column glass-panel";
      column.innerHTML = `
        <div class="compare-column-header">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700;">${floor}층 ${zoneName} ${getRowName(row - 1)}열 ${seatNum}번</h3>
            <span style="font-size: 0.8rem; color: var(--text-sub);">${seatClass}석</span>
          </div>
          <button class="remove-compare-btn" data-compare-id="${seatId}">✕</button>
        </div>
        
        <div class="compare-photo">
          <img src="${viewImgUrl}" alt="시야 이미지">
        </div>

        <div class="compare-metrics">
          <div class="compare-metric-row">
            <span class="compare-metric-label">평균 시야 평점</span>
            <span class="compare-metric-value" style="color: #fbbf24;">${starsHtml} (${avgRatingText})</span>
          </div>
          <div class="compare-metric-row">
            <span class="compare-metric-label">리뷰 수</span>
            <span class="compare-metric-value">${seatReviews.length}개</span>
          </div>
          <div class="compare-metric-row">
            <span class="compare-metric-label">기본 시야 상태</span>
            <span class="compare-metric-value">${zoneId.endsWith("-C") ? "무대 정면 시야" : "사이드 각도 시야"}</span>
          </div>
        </div>

        <div class="compare-reviews-container">
          <h4>최근 작성된 코멘트</h4>
          <div class="compare-reviews-list">
            ${
              seatReviews.length === 0 
                ? `<div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 1.5rem;">작성된 리뷰 없음</div>`
                : seatReviews.map(r => `
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.8rem; margin-bottom: 0.5rem;">
                      <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-dim); margin-bottom:0.2rem;">
                        <span>${r.user}</span>
                        <span>${r.date}</span>
                      </div>
                      <p style="color: var(--text-main); line-height: 1.3;">${r.content}</p>
                    </div>
                  `).join("")
            }
          </div>
        </div>
      `;

      // Remove handler inside Compare page
      column.querySelector(".remove-compare-btn").addEventListener("click", () => {
        compareList = compareList.filter(id => id !== seatId);
        compareSelectedCount.textContent = `선택한 좌석: ${compareList.length} / 3`;
        compareSubmitBtn.disabled = compareList.length < 2;
        
        if (compareList.length === 0) {
          switchView("theater");
        } else {
          renderCompareView();
        }
      });

      compareColumnsWrapper.appendChild(column);
    });
  }

  // --- REVIEW WRITE PROCESS: MODAL CONTROLS & SUBMIT ---
  
  // Show image preview when selected
  reviewFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        tempUploadedImageBase64 = evt.target.result; // Base64 data url
        uploadPreviewImg.src = tempUploadedImageBase64;
        uploadPreviewBox.style.display = "block";
        fileDropArea.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Star input interactive triggers
  starRatingInput.querySelectorAll("span").forEach(star => {
    star.addEventListener("click", () => {
      const val = parseInt(star.dataset.val);
      tempStarRating = val;
      reviewRatingVal.value = val;
      
      // Update UI highlights
      starRatingInput.querySelectorAll("span").forEach(s => {
        const sVal = parseInt(s.dataset.val);
        if (sVal <= val) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  addReviewTriggerBtn.addEventListener("click", () => {
    // Check Login
    if (!loggedInUser) {
      alert("리뷰 작성을 위해서는 로그인이 필요합니다.");
      loginModal.classList.add("active");
      return;
    }

    // Reset Review Form State
    tempStarRating = 0;
    tempUploadedImageBase64 = "";
    reviewRatingVal.value = "";
    reviewCommentInput.value = "";
    reviewFileInput.value = "";
    uploadPreviewBox.style.display = "none";
    fileDropArea.style.display = "flex";
    starRatingInput.querySelectorAll("span").forEach(s => s.classList.remove("active"));

    // Set title
    const parts = selectedSeat.split("-");
    const floor = parts[1];
    const zoneId = parts[2];
    const row = parts[3];
    const seatNum = parts[4];
    const floorObj = selectedTheater.floors.find(f => f.level == floor);
    const zoneObj = floorObj ? floorObj.zones.find(z => z.id === zoneId) : null;
    const zoneName = zoneObj ? zoneObj.name : zoneId;
    
    reviewModalTitle.textContent = `${floor}층 ${zoneName} ${getRowName(row - 1)}열 ${seatNum}번 시야 등록`;
    reviewModal.classList.add("active");
  });

  reviewModalClose.addEventListener("click", () => {
    reviewModal.classList.remove("active");
  });

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (tempStarRating === 0) {
      alert("시야 만족도 별점을 입력해 주세요.");
      return;
    }
    
    if (!tempUploadedImageBase64) {
      alert("실제 시야 사진을 등록해 주세요.");
      return;
    }

    const comment = reviewCommentInput.value.trim();
    if (!comment) {
      alert("코멘트를 작성해 주세요.");
      return;
    }

    // Assemble new review
    const newRev = {
      id: "rev_" + Date.now(),
      user: loggedInUser,
      rating: tempStarRating,
      date: new Date().toISOString().split("T")[0],
      content: comment,
      image: tempUploadedImageBase64
    };

    // Store in reviews state
    if (!reviews[selectedSeat]) {
      reviews[selectedSeat] = [];
    }
    reviews[selectedSeat].push(newRev);

    // Persist to LocalStorage
    localStorage.setItem("SEEYA_REVIEWS", JSON.stringify(reviews));

    // Success notification and refresh layout
    alert("시야 리뷰가 성공적으로 등록되었습니다!");
    reviewModal.classList.remove("active");
    
    renderSeatMap();
    renderSeatDetail(selectedSeat);
  });

  // --- LIGHTBOX VIEWER ---
  detailViewImg.addEventListener("click", () => {
    if (detailViewImg.src) {
      lightboxImageImg.src = detailViewImg.src;
      
      const parts = selectedSeat.split("-");
      const floor = parts[1];
      const zoneId = parts[2];
      const row = parts[3];
      const seatNum = parts[4];
      const floorObj = selectedTheater.floors.find(f => f.level == floor);
      const zoneObj = floorObj ? floorObj.zones.find(z => z.id === zoneId) : null;
      const zoneName = zoneObj ? zoneObj.name : zoneId;
      
      document.getElementById("photo-viewer-title").textContent = `${floor}층 ${zoneName} ${getRowName(row - 1)}열 ${seatNum}번 시야`;
      photoViewerModal.classList.add("active");
    }
  });

  photoViewerClose.addEventListener("click", () => {
    photoViewerModal.classList.remove("active");
  });

  // Close modals when clicking on background overlays
  [loginModal, reviewModal, photoViewerModal].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });

  // --- TOOLBAR / OPTION HANDLERS ---

  // Select Overlay mode (Tier vs rating colors)
  overlayModeSelect.addEventListener("change", (e) => {
    overlayMode = e.target.value;
    renderSeatMap();
  });

  // Toggle Compare Mode
  compareModeCheckbox.addEventListener("change", (e) => {
    compareMode = e.target.checked;
    
    if (compareMode) {
      // Clear normal seat selection
      selectedSeat = null;
      compareList = [];
      compareSelectedCount.textContent = `선택한 좌석: 0 / 3`;
      compareSubmitBtn.disabled = true;
      compareActionBar.classList.add("active");
      renderSeatDetail(null);
    } else {
      compareActionBar.classList.remove("active");
      compareList = [];
    }
    
    renderSeatMap();
  });

  // Compare Actions
  compareCancelBtn.addEventListener("click", () => {
    compareList = [];
    compareSelectedCount.textContent = `선택한 좌석: 0 / 3`;
    compareSubmitBtn.disabled = true;
    renderSeatMap();
  });

  compareSubmitBtn.addEventListener("click", () => {
    if (compareList.length >= 2) {
      switchView("compare");
    }
  });

  // Back Links
  backToHomeBtn.addEventListener("click", () => {
    switchView("home");
  });

  backToTheaterMapBtn.addEventListener("click", () => {
    switchView("theater");
  });

  logoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    switchView("home");
  });

  // --- INITIALIZATION ---
  updateAuthUI();
  switchView("home");
});
