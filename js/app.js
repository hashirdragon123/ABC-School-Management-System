/**
 * ABC School Management System - Main Application Logic & UI Controller
 */

class SchoolApp {
  constructor() {
    this.store = window.schoolStore;
    
    // Application State
    this.currentRole = "principal"; // "principal" | "teacher" | "parent" | "student"
    this.currentParentId = "PAR-101"; // Default Khan Family
    this.currentStudentId = "STU-801"; // Default Ahmed Khan
    
    // Principal View States
    this.activePrincipalTab = "overview"; // "overview" | "directory" | "families" | "analytics"
    this.searchQuery = "";
    this.gradeFilter = "ALL";
    this.feeFilter = "ALL";
    
    // Teacher View States
    this.activeTeacherTab = "attendance"; // "attendance" | "marks"
    this.teacherGrade = 8;
    this.teacherSubject = "Mathematics";
    this.teacherAttendanceState = {}; // { studentId: true/false }
    
    // Parent View States
    this.activeParentTab = "subjects"; // "subjects" | "fees" | "attendance"
    this.parentSelectedChildId = "STU-801";
    
    // Initialize UI
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Role Switcher Buttons
    document.querySelectorAll("[data-role-switch]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const role = e.currentTarget.dataset.roleSwitch;
        this.switchRole(role);
      });
    });

    // Mobile Navigation Drawer Toggle
    const mobileNavBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    if (mobileNavBtn && mobileDrawer) {
      mobileNavBtn.addEventListener("click", () => {
        mobileDrawer.classList.toggle("hidden");
      });
    }

    // Modal Close Triggers
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modalId = e.currentTarget.dataset.closeModal;
        this.closeModal(modalId);
      });
    });

    // New Admission Form Handling
    const addStudentForm = document.getElementById("admission-form");
    if (addStudentForm) {
      addStudentForm.addEventListener("submit", (e) => this.handleAdmissionSubmit(e));
    }
  }

  switchRole(role) {
    this.currentRole = role;
    
    // Update active state on navigation buttons
    document.querySelectorAll("[data-role-switch]").forEach(btn => {
      if (btn.dataset.roleSwitch === role) {
        btn.classList.add("bg-emerald-500", "text-white", "shadow-sm");
        btn.classList.remove("text-slate-300", "hover:bg-slate-800");
      } else {
        btn.classList.remove("bg-emerald-500", "text-white", "shadow-sm");
        btn.classList.add("text-slate-300", "hover:bg-slate-800");
      }
    });

    // Set default parent/student if switching
    if (role === "parent" && !this.currentParentId) {
      this.currentParentId = "PAR-101"; // Khan Family
    }
    if (role === "student" && !this.currentStudentId) {
      this.currentStudentId = "STU-801"; // Ahmed Khan
    }

    this.render();
    this.showToast(`Switched to ${role.toUpperCase()} View`, "info");
  }

  render() {
    const appContainer = document.getElementById("app-content");
    if (!appContainer) return;

    switch (this.currentRole) {
      case "principal":
        appContainer.innerHTML = this.renderPrincipalDashboard();
        this.attachPrincipalEvents();
        break;
      case "teacher":
        appContainer.innerHTML = this.renderTeacherPortal();
        this.attachTeacherEvents();
        break;
      case "parent":
        appContainer.innerHTML = this.renderParentPortal();
        this.attachParentEvents();
        break;
      case "student":
        appContainer.innerHTML = this.renderStudentPortal();
        this.attachStudentEvents();
        break;
      default:
        appContainer.innerHTML = this.renderPrincipalDashboard();
        this.attachPrincipalEvents();
    }

    this.attachPhotoUploadEvents();
  }

  // ==========================================
  // 1. PRINCIPAL DASHBOARD VIEW
  // ==========================================
  renderPrincipalDashboard() {
    const students = this.store.getStudents();
    const families = this.store.getAllParents();
    
    // KPI Calculations
    const totalStudents = students.length;
    const paidStudents = students.filter(s => s.feeStatus === "Paid");
    const totalRevenue = paidStudents.reduce((acc, s) => acc + s.netFee, 0);
    const totalDiscounts = students.reduce((acc, s) => acc + s.discountAmount, 0);
    const pendingFees = students.filter(s => s.feeStatus === "Pending").reduce((acc, s) => acc + s.netFee, 0);
    
    let totalPresent = 0, totalAtt = 0;
    students.forEach(s => {
      if (s.attendance) {
        totalPresent += s.attendance.present;
        totalAtt += s.attendance.total;
      }
    });
    const avgAttendance = totalAtt > 0 ? Math.round((totalPresent / totalAtt) * 100) : 94;

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Header Banner & Navigation Tabs -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
          <div>
            <div class="flex items-center gap-3">
              <span class="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl text-xl font-bold border border-emerald-500/30">👑</span>
              <div>
                <h1 class="text-2xl font-extrabold tracking-tight">Principal Command Center</h1>
                <p class="text-slate-400 text-sm mt-0.5">ABC School Management & Automated Sibling Discount System</p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button id="open-admission-modal-btn" class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-95 text-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              <span>+ Family / Sibling Admission</span>
            </button>
            <button id="reset-data-btn" class="bg-slate-700/70 hover:bg-slate-700 text-slate-300 font-medium px-3.5 py-2.5 rounded-xl text-sm border border-slate-600/50 transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Reset Mock Dataset</span>
            </button>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Card 1 -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden border-l-4 border-emerald-500">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled</div>
            <div class="text-3xl font-extrabold text-slate-900 mt-2">${totalStudents} <span class="text-xs font-medium text-slate-500">Students</span></div>
            <div class="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 10 Grades Active
            </div>
          </div>

          <!-- Card 2 -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden border-l-4 border-blue-500">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Collected</div>
            <div class="text-3xl font-extrabold text-slate-900 mt-2">${formatCurrency(totalRevenue)}</div>
            <div class="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span> ${paidStudents.length} Invoices Paid
            </div>
          </div>

          <!-- Card 3 -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden border-l-4 border-purple-500">
            <div class="text-xs font-semibold uppercase tracking-wider text-purple-600">Sibling Discounts</div>
            <div class="text-3xl font-extrabold text-purple-900 mt-2">${formatCurrency(totalDiscounts)}</div>
            <div class="text-xs text-purple-600 font-medium mt-2 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span> Saved by Families
            </div>
          </div>

          <!-- Card 4 -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden border-l-4 border-amber-500">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Fees</div>
            <div class="text-3xl font-extrabold text-amber-700 mt-2">${formatCurrency(pendingFees)}</div>
            <div class="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span> ${students.length - paidStudents.length} Pending Accounts
            </div>
          </div>

          <!-- Card 5 -->
          <div class="glass-card p-5 rounded-2xl relative overflow-hidden border-l-4 border-teal-500">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance Rate</div>
            <div class="text-3xl font-extrabold text-slate-900 mt-2">${avgAttendance}%</div>
            <div class="text-xs text-teal-600 font-medium mt-2 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-teal-500"></span> Daily Avg Logged
            </div>
          </div>
        </div>

        <!-- Sibling Discount Logic Banner -->
        <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              %
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Automated Sibling Discount Engine Active</h4>
              <p class="text-xs text-slate-600 mt-0.5">
                <span class="font-semibold text-slate-800">1 Child:</span> Standard Fee (0%) &bull; 
                <span class="font-semibold text-slate-800">2 Siblings:</span> 10% Discount each &bull; 
                <span class="font-semibold text-slate-800">3+ Siblings:</span> 20% Discount on all invoices (e.g. Khan Family gets 20% off all 3 children).
              </p>
            </div>
          </div>
          <span class="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap">
            Auto-Calculated Real-Time
          </span>
        </div>

        <!-- Principal Sub-Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button data-principal-tab="overview" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all ${this.activePrincipalTab === "overview" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}">
            📊 Overview & Directory
          </button>
          <button data-principal-tab="families" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all ${this.activePrincipalTab === "families" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}">
            👨‍👩‍👧‍👦 Family Discount Manager (${families.length} Families)
          </button>
          <button data-principal-tab="analytics" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all ${this.activePrincipalTab === "analytics" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}">
            📈 Fee & Academic Analytics
          </button>
        </div>

        <!-- Tab Content View -->
        ${this.renderPrincipalTabContent()}
      </div>
    `;
  }

  renderPrincipalTabContent() {
    if (this.activePrincipalTab === "families") {
      return this.renderFamiliesTab();
    }
    if (this.activePrincipalTab === "analytics") {
      return this.renderAnalyticsTab();
    }

    // Default Overview / Directory View
    let filtered = this.store.getStudents();

    // Filter Logic
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.rollNo.includes(q) || 
        s.parentName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }

    if (this.gradeFilter !== "ALL") {
      filtered = filtered.filter(s => s.grade === Number(this.gradeFilter));
    }

    if (this.feeFilter !== "ALL") {
      filtered = filtered.filter(s => s.feeStatus === this.feeFilter);
    }

    return `
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
        <!-- Search & Filter Toolbar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="relative w-full md:w-80">
            <svg class="w-5 h-5 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" id="principal-search" value="${this.searchQuery}" placeholder="Search student, roll #, parent..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"/>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <!-- Grade Filter -->
            <select id="principal-grade-filter" class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900">
              <option value="ALL" ${this.gradeFilter === "ALL" ? "selected" : ""}>All Grades (1-10)</option>
              ${[1,2,3,4,5,6,7,8,9,10].map(g => `<option value="${g}" ${this.gradeFilter == g ? "selected" : ""}>Grade ${g}</option>`).join("")}
            </select>

            <!-- Fee Status Filter -->
            <select id="principal-fee-filter" class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900">
              <option value="ALL" ${this.feeFilter === "ALL" ? "selected" : ""}>All Fee Statuses</option>
              <option value="Paid" ${this.feeFilter === "Paid" ? "selected" : ""}>Paid Only</option>
              <option value="Pending" ${this.feeFilter === "Pending" ? "selected" : ""}>Pending Only</option>
            </select>

            <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
              Showing ${filtered.length} of ${this.store.getStudents().length}
            </span>
          </div>
        </div>

        <!-- Student Directory Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Student & Roll #</th>
                <th class="py-3.5 px-4">Grade</th>
                <th class="py-3.5 px-4">Parent Details</th>
                <th class="py-3.5 px-4 text-center">Sibling Discount</th>
                <th class="py-3.5 px-4 text-right">Fee Breakdown</th>
                <th class="py-3.5 px-4 text-center">Fee Status</th>
                <th class="py-3.5 px-4 text-center">Overall %</th>
                <th class="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="8" class="text-center py-10 text-slate-400 font-medium">No student records match search filter.</td>
                </tr>
              ` : filtered.map(s => `
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="avatar-container cursor-pointer" data-upload-photo="${s.id}" title="Click to upload photo for ${s.name}">
                        <img src="${s.avatar}" alt="${s.name}" class="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                        <div class="avatar-upload-overlay rounded-full text-[8px]">
                          <span>📷</span>
                        </div>
                      </div>
                      <div>
                        <div class="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>${s.name}</span>
                          <button data-upload-photo="${s.id}" class="text-[10px] text-slate-400 hover:text-slate-600" title="Upload Photo">📷</button>
                        </div>
                        <div class="text-xs text-slate-400 font-mono">Roll #${s.rollNo} | ID: ${s.id}</div>
                      </div>
                    </div>
                  </td>

                  <td class="py-3 px-4 font-semibold text-slate-700">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      Grade ${s.grade}-${s.section}
                    </span>
                  </td>

                  <td class="py-3 px-4">
                    <div class="font-semibold text-slate-800">${s.parentName}</div>
                    <div class="text-xs text-slate-400">${s.parentPhone}</div>
                  </td>

                  <td class="py-3 px-4 text-center">
                    ${s.discountPercent > 0 ? `
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        ⚡ ${s.discountPercent}% (${s.siblingCount} Siblings)
                      </span>
                    ` : `
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-slate-400 bg-slate-100">
                        0% Single Child
                      </span>
                    `}
                  </td>

                  <td class="py-3 px-4 text-right font-mono">
                    <div class="text-slate-400 text-xs line-through">${formatCurrency(s.baseFee)}</div>
                    <div class="font-bold text-slate-900">${formatCurrency(s.netFee)} <span class="text-[10px] text-slate-500 font-normal">/mo</span></div>
                  </td>

                  <td class="py-3 px-4 text-center">
                    <button data-toggle-fee="${s.id}" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 ${
                      s.feeStatus === "Paid" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200" 
                        : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                    }">
                      ${s.feeStatus === "Paid" ? "✓ Paid" : "⏳ Pending"}
                    </button>
                  </td>

                  <td class="py-3 px-4 text-center font-bold">
                    <span class="px-2.5 py-1 rounded-lg text-xs ${
                      s.overallPercentage >= 90 ? "bg-emerald-100 text-emerald-800" :
                      s.overallPercentage >= 80 ? "bg-blue-100 text-blue-800" :
                      s.overallPercentage >= 70 ? "bg-indigo-100 text-indigo-800" :
                      s.overallPercentage >= 60 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }">
                      ${s.overallPercentage}%
                    </span>
                  </td>

                  <td class="py-3 px-4 text-center space-x-1 whitespace-nowrap">
                    <button data-view-invoice="${s.id}" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 transition-colors" title="View Invoice">
                      🧾 Invoice
                    </button>
                    <button data-view-report="${s.id}" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-300 transition-colors" title="Report Card">
                      📜 Marks
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderFamiliesTab() {
    const families = this.store.getAllParents();

    return `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 mb-1">Registered Family Units & Automated Sibling Discounts</h3>
          <p class="text-xs text-slate-500 mb-6">Grouped by Parent ID. When multiple siblings enroll under the same Parent ID, discounts are automatically synchronized across all children.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${families.map(fam => {
              const children = fam.children;
              const siblingCount = children.length;
              const discountRate = calculateDiscountRate(siblingCount);
              const totalBase = children.reduce((acc, c) => acc + c.baseFee, 0);
              const totalDiscount = children.reduce((acc, c) => acc + c.discountAmount, 0);
              const totalNet = children.reduce((acc, c) => acc + c.netFee, 0);

              return `
                <div class="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-white to-slate-50/50 shadow-sm hover:shadow-md transition-all">
                  <div class="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">${fam.parentId}</span>
                      <h4 class="font-extrabold text-slate-900 text-base">${fam.parentName}</h4>
                      <div class="text-xs text-slate-500 mt-0.5">${fam.parentEmail}</div>
                    </div>

                    <span class="px-3 py-1 rounded-full text-xs font-bold ${
                      discountRate === 20 ? "bg-purple-100 text-purple-800 border border-purple-200" :
                      discountRate === 10 ? "bg-blue-100 text-blue-800 border border-blue-200" :
                      "bg-slate-100 text-slate-600"
                    }">
                      ${discountRate}% Discount (${siblingCount} ${siblingCount === 1 ? "Child" : "Siblings"})
                    </span>
                  </div>

                  <!-- Children List -->
                  <div class="space-y-2 mb-4">
                    <div class="text-xs font-bold text-slate-700 uppercase tracking-wider">Enrolled Children:</div>
                    ${children.map(c => `
                      <div class="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-100">
                        <div class="flex items-center gap-2">
                          <img src="${c.avatar}" class="w-6 h-6 rounded-full object-cover" />
                          <span class="font-semibold text-slate-800">${c.name}</span>
                          <span class="text-[10px] text-slate-400">(Grade ${c.grade})</span>
                        </div>
                        <div class="font-mono text-slate-700">
                          <span class="line-through text-slate-400 mr-1">${formatCurrency(c.baseFee)}</span>
                          <span class="font-bold text-emerald-600">${formatCurrency(c.netFee)}</span>
                        </div>
                      </div>
                    `).join("")}
                  </div>

                  <!-- Family Financial Summary -->
                  <div class="bg-slate-900 text-white rounded-xl p-3 text-xs space-y-1 font-mono">
                    <div class="flex justify-between text-slate-300">
                      <span>Total Base Monthly:</span>
                      <span>${formatCurrency(totalBase)}</span>
                    </div>
                    <div class="flex justify-between text-purple-300 font-semibold">
                      <span>Sibling Savings (${discountRate}%):</span>
                      <span>-${formatCurrency(totalDiscount)}</span>
                    </div>
                    <div class="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-slate-700">
                      <span>Net Monthly Payable:</span>
                      <span>${formatCurrency(totalNet)}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  renderAnalyticsTab() {
    const students = this.store.getStudents();
    
    // Calculate grade averages
    const gradeAverages = {};
    [1,2,3,4,5,6,7,8,9,10].forEach(g => {
      const gStus = students.filter(s => s.grade === g);
      if (gStus.length > 0) {
        const avg = gStus.reduce((acc, s) => acc + s.overallPercentage, 0) / gStus.length;
        gradeAverages[g] = Math.round(avg * 10) / 10;
      } else {
        gradeAverages[g] = 0;
      }
    });

    // Subject averages across 11 subjects
    const subjectAverages = {};
    CORE_SUBJECTS.forEach(sub => {
      let sum = 0, count = 0;
      students.forEach(s => {
        if (s.marks && s.marks[sub] !== undefined) {
          sum += s.marks[sub];
          count++;
        }
      });
      subjectAverages[sub] = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    });

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Grade Performance Chart Card -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-base font-bold text-slate-900">Grade-wise Average Performance (%)</h3>
            <div class="space-y-3">
              ${Object.keys(gradeAverages).map(g => {
                const avg = gradeAverages[g];
                return `
                  <div>
                    <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Grade ${g}</span>
                      <span>${avg}%</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div class="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style="width: ${avg}%"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- 11 Subject Average Breakdown -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-base font-bold text-slate-900">11 Core Subjects Performance Index</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${CORE_SUBJECTS.map((sub, idx) => {
                const score = subjectAverages[sub];
                return `
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">${idx + 1}</span>
                      <span class="text-xs font-bold text-slate-800">${sub}</span>
                    </div>
                    <span class="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                      ${score}%
                    </span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachPrincipalEvents() {
    // Search input
    const searchInput = document.getElementById("principal-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Filter dropdowns
    const gradeFilter = document.getElementById("principal-grade-filter");
    if (gradeFilter) {
      gradeFilter.addEventListener("change", (e) => {
        this.gradeFilter = e.target.value;
        this.render();
      });
    }

    const feeFilter = document.getElementById("principal-fee-filter");
    if (feeFilter) {
      feeFilter.addEventListener("change", (e) => {
        this.feeFilter = e.target.value;
        this.render();
      });
    }

    // Sub-tab switcher buttons
    document.querySelectorAll("[data-principal-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activePrincipalTab = e.currentTarget.dataset.principalTab;
        this.render();
      });
    });

    // Reset dataset button
    const resetBtn = document.getElementById("reset-data-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset dataset back to the initial 18 pre-loaded student records?")) {
          this.store.resetData();
          this.render();
          this.showToast("Dataset reset to original 18 student mock data!", "success");
        }
      });
    }

    // Admission Modal Opener
    const openAdmissionBtn = document.getElementById("open-admission-modal-btn");
    if (openAdmissionBtn) {
      openAdmissionBtn.addEventListener("click", () => {
        this.openAdmissionModal();
      });
    }

    // Fee Toggle Buttons
    document.querySelectorAll("[data-toggle-fee]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.toggleFee;
        this.store.toggleFeeStatus(stuId);
        this.render();
        this.showToast(`Updated fee status for student ${stuId}`, "success");
      });
    });

    // View Invoice Modal
    document.querySelectorAll("[data-view-invoice]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.viewInvoice;
        this.openInvoiceModal(stuId);
      });
    });

    // View Report Card Modal
    document.querySelectorAll("[data-view-report]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.viewReport;
        this.openReportCardModal(stuId);
      });
    });
  }

  // ==========================================
  // 2. PARENT PORTAL VIEW (Multi-Child Support)
  // ==========================================
  renderParentPortal() {
    const parents = this.store.getAllParents();
    const currentParent = parents.find(p => p.parentId === this.currentParentId) || parents[0];
    const children = currentParent ? currentParent.children : [];
    
    // Ensure selected child belongs to this parent
    let selectedChild = children.find(c => c.id === this.parentSelectedChildId);
    if (!selectedChild && children.length > 0) {
      selectedChild = children[0];
      this.parentSelectedChildId = selectedChild.id;
    }

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Parent Header & Account Switcher -->
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/50">
          <div>
            <div class="flex items-center gap-3">
              <span class="bg-purple-500/20 text-purple-400 p-2 rounded-xl text-xl font-bold border border-purple-500/30">👨‍👩‍👧‍👦</span>
              <div>
                <h1 class="text-2xl font-extrabold">Parent Portal Gateway</h1>
                <p class="text-slate-400 text-sm">Viewing Account: <span class="text-white font-bold">${currentParent.parentName}</span> (${currentParent.parentId})</p>
              </div>
            </div>
          </div>

          <!-- Quick Parent Selector Dropdown -->
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Family Account:</span>
            <select id="parent-account-selector" class="bg-slate-800 border border-slate-700 text-white text-sm font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
              ${parents.map(p => `
                <option value="${p.parentId}" ${p.parentId === currentParent.parentId ? "selected" : ""}>
                  ${p.parentName} (${p.children.length} ${p.children.length === 1 ? "Child" : "Children"})
                </option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- LINKED CHILDREN SINGLE SCREEN SUMMARY GRID -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Linked Children Profiles</span>
              <span class="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                ${children.length} Enrolled
              </span>
            </h3>

            ${children.length >= 2 ? `
              <div class="bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5">
                <span>⚡ ${calculateDiscountRate(children.length)}% Sibling Discount Active</span>
              </div>
            ` : ""}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${children.map(child => {
              const isSelected = child.id === this.parentSelectedChildId;
              return `
                <div data-select-child="${child.id}" class="cursor-pointer rounded-2xl p-5 border transition-all relative group ${
                  isSelected 
                    ? "bg-gradient-to-br from-purple-900 to-slate-900 text-white border-purple-500 shadow-lg ring-2 ring-purple-400 scale-[1.02]" 
                    : "bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200"
                }">
                  <div class="flex items-center gap-4">
                    <div class="avatar-container group relative" data-upload-photo="${child.id}" title="Click to upload photo for ${child.name}">
                      <img src="${child.avatar}" class="w-14 h-14 rounded-2xl object-cover border-2 ${isSelected ? "border-purple-400" : "border-slate-300"}" />
                      <div class="avatar-upload-overlay rounded-2xl">
                        <span class="text-xs">📷</span>
                        <span class="text-[9px]">Photo</span>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <h4 class="font-extrabold text-base ${isSelected ? "text-white" : "text-slate-900"}">${child.name}</h4>
                        <button data-upload-photo="${child.id}" class="text-[10px] bg-slate-200/60 hover:bg-purple-600 hover:text-white font-bold px-2 py-0.5 rounded-md transition-all flex items-center gap-1 text-slate-700" title="Upload Photo">
                          📷 Photo
                        </button>
                      </div>
                      <div class="text-xs ${isSelected ? "text-purple-200" : "text-slate-500"}">Grade ${child.grade}-${child.section} | Roll #${child.rollNo}</div>
                      
                      <div class="mt-2 flex items-center justify-between text-xs">
                        <span class="font-semibold ${isSelected ? "text-slate-300" : "text-slate-600"}">Overall %:</span>
                        <span class="font-extrabold text-sm ${
                          child.overallPercentage >= 90 ? "text-emerald-400" :
                          child.overallPercentage >= 80 ? "text-blue-400" : "text-amber-400"
                        }">${child.overallPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- SELECTED CHILD DETAILED ACADEMIC & FEE DASHBOARD -->
        ${selectedChild ? this.renderChildDetailsView(selectedChild, children.length) : ""}
      </div>
    `;
  }

  renderChildDetailsView(child, siblingCount) {
    const discountRate = calculateDiscountRate(siblingCount);
    
    return `
      <div class="space-y-6">
        <!-- Child Profile Bar & Sub-Tabs -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="avatar-container cursor-pointer" data-upload-photo="${child.id}" title="Click to upload photo for ${child.name}">
              <img src="${child.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md" />
              <div class="avatar-upload-overlay rounded-2xl">
                <span class="text-sm">📷</span>
                <span class="text-[9px]">Photo</span>
              </div>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-xl font-extrabold text-slate-900">${child.name}</h2>
                <span class="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Grade ${child.grade}-${child.section}</span>
                <button data-upload-photo="${child.id}" class="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-xl border border-purple-200 transition-all flex items-center gap-1.5 shadow-sm">
                  📷 Upload / Change Photo
                </button>
              </div>
              <p class="text-xs text-slate-500 mt-1">Roll Number: ${child.rollNo} | ID: ${child.id}</p>
            </div>
          </div>

          <!-- Parent Tabs Switcher -->
          <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
            <button data-parent-tab="subjects" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${this.activeParentTab === "subjects" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}">
              📚 11 Subjects Report Card
            </button>
            <button data-parent-tab="fees" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${this.activeParentTab === "fees" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}">
              💳 Fee Breakdown & Discounts
            </button>
            <button data-parent-tab="attendance" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${this.activeParentTab === "attendance" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}">
              📅 Attendance Log
            </button>
          </div>
        </div>

        <!-- TAB 1: 11 CORE SUBJECTS REPORT CARD -->
        ${this.activeParentTab === "subjects" ? `
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 class="text-lg font-extrabold text-slate-900">Academic Scorecard (11 Core Subjects)</h3>
                <p class="text-xs text-slate-500">Comprehensive term evaluation across all required curriculum subjects.</p>
              </div>

              <button data-print-report="${child.id}" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                <span>Print Official Report Card</span>
              </button>
            </div>

            <!-- Subject Scores Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">#</th>
                    <th class="py-3 px-4">Core Subject</th>
                    <th class="py-3 px-4 text-center">Max Marks</th>
                    <th class="py-3 px-4 text-center">Marks Obtained</th>
                    <th class="py-3 px-4 text-center">Percentage</th>
                    <th class="py-3 px-4 text-center">Grade Letter</th>
                    <th class="py-3 px-4">Performance Indicator</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white font-medium">
                  ${CORE_SUBJECTS.map((sub, idx) => {
                    const score = child.marks ? (child.marks[sub] || 0) : 0;
                    const gradeInfo = getGradeLetter(score);

                    return `
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="py-3 px-4 font-mono text-xs text-slate-400">${idx + 1}</td>
                        <td class="py-3 px-4 font-bold text-slate-900">${sub}</td>
                        <td class="py-3 px-4 text-center font-mono text-slate-400">100</td>
                        <td class="py-3 px-4 text-center font-bold font-mono text-slate-900">${score}</td>
                        <td class="py-3 px-4 text-center font-bold font-mono">${score}%</td>
                        <td class="py-3 px-4 text-center">
                          <span class="px-2.5 py-1 rounded-md text-xs font-bold ${gradeInfo.bg} ${gradeInfo.text}">
                            ${gradeInfo.letter}
                          </span>
                        </td>
                        <td class="py-3 px-4">
                          <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div class="h-2.5 rounded-full ${
                              score >= 90 ? "bg-emerald-500" :
                              score >= 80 ? "bg-blue-500" :
                              score >= 70 ? "bg-indigo-500" : "bg-amber-500"
                            }" style="width: ${score}%"></div>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>

            <!-- Overall Performance Summary -->
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher Remarks:</span>
                <p class="text-xs text-slate-700 font-medium italic mt-1">"${child.teacherNotes}"</p>
              </div>

              <div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div class="text-right">
                  <div class="text-[10px] font-bold text-slate-400 uppercase">Overall Average</div>
                  <div class="text-xl font-extrabold text-slate-900">${child.overallPercentage}%</div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-extrabold text-lg">
                  ${getGradeLetter(child.overallPercentage).letter}
                </div>
              </div>
            </div>
          </div>
        ` : ""}

        <!-- TAB 2: FEE BREAKDOWN & SIBLING DISCOUNT -->
        ${this.activeParentTab === "fees" ? `
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 class="text-lg font-extrabold text-slate-900">Fee Statement & Itemized Invoicing</h3>
                <p class="text-xs text-slate-500">Includes base tuition and automated sibling discount calculations.</p>
              </div>

              <div class="flex items-center gap-2">
                <button data-print-invoice="${child.id}" class="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all flex items-center gap-2">
                  <span>🧾 View Invoice Receipt</span>
                </button>
                ${child.feeStatus === "Pending" ? `
                  <button data-pay-online="${child.id}" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
                    💳 Pay Online Now (${formatCurrency(child.netFee)})
                  </button>
                ` : ""}
              </div>
            </div>

            <!-- Itemized Fee Calculation Box -->
            <div class="max-w-2xl mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 font-mono">
              <div class="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                <span class="text-slate-600">Grade ${child.grade} Monthly Tuition Base Fee:</span>
                <span class="font-bold text-slate-900">${formatCurrency(child.baseFee)}</span>
              </div>

              <div class="flex justify-between items-center text-sm border-b border-slate-200 pb-3 text-purple-700 font-semibold">
                <span class="flex items-center gap-1.5">
                  <span>⚡ Sibling Discount (${discountRate}% for ${siblingCount} siblings):</span>
                </span>
                <span>-${formatCurrency(child.discountAmount)}</span>
              </div>

              <div class="flex justify-between items-center text-lg font-extrabold text-slate-900 pt-2">
                <span>Net Monthly Amount Due:</span>
                <span class="text-emerald-600">${formatCurrency(child.netFee)}</span>
              </div>

              <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs font-sans mt-4">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-700">Payment Status:</span>
                  <span class="px-3 py-1 rounded-full text-xs font-bold ${
                    child.feeStatus === "Paid" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"
                  }">
                    ${child.feeStatus === "Paid" ? "✓ Paid in Full" : "⏳ Pending Payment"}
                  </span>
                </div>
                <div class="text-slate-400">Due Date: ${child.dueDate}</div>
              </div>
            </div>
          </div>
        ` : ""}

        <!-- TAB 3: ATTENDANCE LOG -->
        ${this.activeParentTab === "attendance" ? `
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-lg font-extrabold text-slate-900">Attendance Log</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <div class="text-xs font-bold text-emerald-800 uppercase">Days Present</div>
                <div class="text-2xl font-extrabold text-emerald-900 mt-1">${child.attendance ? child.attendance.present : 20} Days</div>
              </div>
              <div class="bg-rose-50 p-4 rounded-xl border border-rose-200">
                <div class="text-xs font-bold text-rose-800 uppercase">Days Absent</div>
                <div class="text-2xl font-extrabold text-rose-900 mt-1">${child.attendance ? child.attendance.absent : 1} Days</div>
              </div>
              <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div class="text-xs font-bold text-blue-800 uppercase">Attendance Rate</div>
                <div class="text-2xl font-extrabold text-blue-900 mt-1">
                  ${child.attendance && child.attendance.total > 0 ? Math.round((child.attendance.present / child.attendance.total) * 100) : 95}%
                </div>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  attachParentEvents() {
    // Parent Account Selector Dropdown
    const parentSelector = document.getElementById("parent-account-selector");
    if (parentSelector) {
      parentSelector.addEventListener("change", (e) => {
        this.currentParentId = e.target.value;
        const parents = this.store.getAllParents();
        const p = parents.find(x => x.parentId === this.currentParentId);
        if (p && p.children.length > 0) {
          this.parentSelectedChildId = p.children[0].id;
        }
        this.render();
      });
    }

    // Select Child Card Trigger
    document.querySelectorAll("[data-select-child]").forEach(card => {
      card.addEventListener("click", (e) => {
        this.parentSelectedChildId = e.currentTarget.dataset.selectChild;
        this.render();
      });
    });

    // Parent Sub-tab triggers
    document.querySelectorAll("[data-parent-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeParentTab = e.currentTarget.dataset.parentTab;
        this.render();
      });
    });

    // Print Report Card Button
    document.querySelectorAll("[data-print-report]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.printReport;
        this.openReportCardModal(stuId);
      });
    });

    // Print Invoice Button
    document.querySelectorAll("[data-print-invoice]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.printInvoice;
        this.openInvoiceModal(stuId);
      });
    });

    // Pay Online Button
    document.querySelectorAll("[data-pay-online]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.payOnline;
        this.openPayOnlineModal(stuId);
      });
    });
  }

  // ==========================================
  // 3. TEACHER PORTAL VIEW (Attendance & Marks)
  // ==========================================
  renderTeacherPortal() {
    const classStudents = this.store.getStudents().filter(s => s.grade === Number(this.teacherGrade));
    
    // Initialize temporary local attendance state for this grade if empty
    classStudents.forEach(s => {
      if (this.teacherAttendanceState[s.id] === undefined) {
        this.teacherAttendanceState[s.id] = true; // default present
      }
    });

    const presentCount = Object.values(this.teacherAttendanceState).filter(Boolean).length;
    const absentCount = classStudents.length - presentCount;

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Teacher Portal Header -->
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/50">
          <div>
            <div class="flex items-center gap-3">
              <span class="bg-blue-500/20 text-blue-400 p-2 rounded-xl text-xl font-bold border border-blue-500/30">👨‍🏫</span>
              <div>
                <h1 class="text-2xl font-extrabold">Teacher Digital Register & Gradebook</h1>
                <p class="text-slate-400 text-sm">Mobile-Optimized Daily Attendance Book & Marks Management</p>
              </div>
            </div>
          </div>

          <!-- Grade & Tab Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-xs font-semibold text-slate-300">Select Grade:</span>
            <select id="teacher-grade-select" class="bg-slate-800 border border-slate-700 text-white font-bold text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              ${[1,2,3,4,5,6,7,8,9,10].map(g => `<option value="${g}" ${this.teacherGrade == g ? "selected" : ""}>Grade ${g}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Teacher Register Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button data-teacher-tab="attendance" class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${this.activeTeacherTab === "attendance" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}">
            📋 Attendance Register (Grade ${this.teacherGrade})
          </button>
          <button data-teacher-tab="marks" class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${this.activeTeacherTab === "marks" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}">
            📝 11-Subject Marks Entry Register
          </button>
        </div>

        <!-- TAB 1: DIGITAL ATTENDANCE REGISTER -->
        ${this.activeTeacherTab === "attendance" ? `
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <!-- Register Status Bar -->
            <div class="register-book p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Daily Register Log</span>
                <h3 class="text-lg font-extrabold">Grade ${this.teacherGrade} Attendance Book</h3>
                <div class="text-xs text-slate-300 mt-1">Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>

              <div class="flex items-center gap-4">
                <div class="bg-slate-800/90 px-4 py-2 rounded-xl text-center border border-slate-700">
                  <div class="text-xs text-slate-400">Present</div>
                  <div class="text-xl font-extrabold text-emerald-400">${presentCount}</div>
                </div>
                <div class="bg-slate-800/90 px-4 py-2 rounded-xl text-center border border-slate-700">
                  <div class="text-xs text-slate-400">Absent</div>
                  <div class="text-xl font-extrabold text-rose-400">${absentCount}</div>
                </div>
              </div>
            </div>

            <!-- Quick Action Toolbar -->
            <div class="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div class="flex items-center gap-2">
                <button id="mark-all-present" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors">
                  ✓ Mark All Present
                </button>
                <button id="mark-all-absent" class="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-300 transition-colors">
                  ✗ Mark All Absent
                </button>
              </div>

              <button id="save-attendance-btn" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-all">
                Save & Submit Attendance
              </button>
            </div>

            <!-- Mobile-Friendly Student Register List -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${classStudents.length === 0 ? `
                <div class="col-span-2 text-center py-10 text-slate-400">No students currently enrolled in Grade ${this.teacherGrade}.</div>
              ` : classStudents.map(s => {
                const isPresent = this.teacherAttendanceState[s.id] !== false;
                return `
                  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <img src="${s.avatar}" class="w-10 h-10 rounded-full object-cover border border-slate-300" />
                      <div>
                        <div class="font-bold text-slate-900 text-sm">${s.name}</div>
                        <div class="text-xs text-slate-400 font-mono">Roll #${s.rollNo}</div>
                      </div>
                    </div>

                    <!-- Attendance Toggle Switch -->
                    <div class="flex items-center gap-1.5">
                      <button data-att-toggle="${s.id}" data-val="true" class="attendance-btn-present ${isPresent ? "active" : ""} px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
                        ✓ Present
                      </button>
                      <button data-att-toggle="${s.id}" data-val="false" class="attendance-btn-absent ${!isPresent ? "active" : ""} px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
                        ✗ Absent
                      </button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : ""}

        <!-- TAB 2: 11-SUBJECT MARKS ENTRY REGISTER -->
        ${this.activeTeacherTab === "marks" ? `
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 class="text-lg font-extrabold text-slate-900">Grade ${this.teacherGrade} Marks Book</h3>
                <p class="text-xs text-slate-500">Update student scores out of 100 across subjects.</p>
              </div>

              <!-- Subject Selector -->
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-slate-700">Subject:</span>
                <select id="teacher-subject-select" class="bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900">
                  ${CORE_SUBJECTS.map(sub => `
                    <option value="${sub}" ${this.teacherSubject === sub ? "selected" : ""}>${sub}</option>
                  `).join("")}
                </select>
              </div>
            </div>

            <!-- Marks Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">Student & Roll #</th>
                    <th class="py-3 px-4">Subject</th>
                    <th class="py-3 px-4 text-center">Max Marks</th>
                    <th class="py-3 px-4 text-center">Marks Input (0-100)</th>
                    <th class="py-3 px-4 text-center">Current Grade</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white font-medium">
                  ${classStudents.map(s => {
                    const currentScore = s.marks ? (s.marks[this.teacherSubject] || 0) : 0;
                    const gradeInfo = getGradeLetter(currentScore);

                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="py-3 px-4 font-bold text-slate-900">${s.name} (Roll #${s.rollNo})</td>
                        <td class="py-3 px-4 text-slate-700 font-semibold">${this.teacherSubject}</td>
                        <td class="py-3 px-4 text-center font-mono">100</td>
                        <td class="py-3 px-4 text-center">
                          <input type="number" min="0" max="100" value="${currentScore}" data-update-mark-id="${s.id}" class="w-20 text-center py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </td>
                        <td class="py-3 px-4 text-center">
                          <span class="px-2.5 py-1 rounded-md text-xs font-bold ${gradeInfo.bg} ${gradeInfo.text}">
                            ${gradeInfo.letter} (${currentScore}%)
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  attachTeacherEvents() {
    const gradeSelect = document.getElementById("teacher-grade-select");
    if (gradeSelect) {
      gradeSelect.addEventListener("change", (e) => {
        this.teacherGrade = Number(e.target.value);
        this.teacherAttendanceState = {};
        this.render();
      });
    }

    document.querySelectorAll("[data-teacher-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeTeacherTab = e.currentTarget.dataset.teacherTab;
        this.render();
      });
    });

    // Attendance toggles
    document.querySelectorAll("[data-att-toggle]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const stuId = e.currentTarget.dataset.attToggle;
        const val = e.currentTarget.dataset.val === "true";
        this.teacherAttendanceState[stuId] = val;
        this.render();
      });
    });

    // Mark all present / absent
    const markAllPresent = document.getElementById("mark-all-present");
    if (markAllPresent) {
      markAllPresent.addEventListener("click", () => {
        const classStudents = this.store.getStudents().filter(s => s.grade === Number(this.teacherGrade));
        classStudents.forEach(s => this.teacherAttendanceState[s.id] = true);
        this.render();
      });
    }

    const markAllAbsent = document.getElementById("mark-all-absent");
    if (markAllAbsent) {
      markAllAbsent.addEventListener("click", () => {
        const classStudents = this.store.getStudents().filter(s => s.grade === Number(this.teacherGrade));
        classStudents.forEach(s => this.teacherAttendanceState[s.id] = false);
        this.render();
      });
    }

    // Save Attendance
    const saveAttBtn = document.getElementById("save-attendance-btn");
    if (saveAttBtn) {
      saveAttBtn.addEventListener("click", () => {
        const updates = Object.keys(this.teacherAttendanceState).map(stuId => ({
          studentId: stuId,
          isPresent: this.teacherAttendanceState[stuId]
        }));
        this.store.bulkUpdateAttendance(updates);
        this.showToast(`Daily attendance saved for Grade ${this.teacherGrade}!`, "success");
      });
    }

    // Subject dropdown for marks
    const subjectSelect = document.getElementById("teacher-subject-select");
    if (subjectSelect) {
      subjectSelect.addEventListener("change", (e) => {
        this.teacherSubject = e.target.value;
        this.render();
      });
    }

    // Marks inputs live update
    document.querySelectorAll("[data-update-mark-id]").forEach(input => {
      input.addEventListener("change", (e) => {
        const stuId = e.target.dataset.updateMarkId;
        const val = e.target.value;
        this.store.updateStudentSubjectMarks(stuId, this.teacherSubject, val);
        this.render();
        this.showToast(`Updated ${this.teacherSubject} mark to ${val} for student ${stuId}`, "info");
      });
    });
  }

  // ==========================================
  // 4. STUDENT PORTAL VIEW
  // ==========================================
  renderStudentPortal() {
    const students = this.store.getStudents();
    const currentStudent = students.find(s => s.id === this.currentStudentId) || students[0];

    return `
      <div class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/50">
          <div>
            <div class="flex items-center gap-3">
              <span class="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl text-xl font-bold border border-emerald-500/30">🎓</span>
              <div>
                <h1 class="text-2xl font-extrabold">Student Portal Gateway</h1>
                <p class="text-slate-400 text-sm">Logged in as: <span class="text-white font-bold">${currentStudent.name}</span> (Roll #${currentStudent.rollNo})</p>
              </div>
            </div>
          </div>

          <!-- Switch Student Selector -->
          <select id="student-selector-dropdown" class="bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-xl px-3.5 py-2">
            ${students.map(s => `
              <option value="${s.id}" ${s.id === currentStudent.id ? "selected" : ""}>${s.name} (Grade ${s.grade})</option>
            `).join("")}
          </select>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
            <img src="${currentStudent.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300" />
            <div>
              <h2 class="text-xl font-extrabold text-slate-900">${currentStudent.name}</h2>
              <div class="text-xs text-slate-500 mt-1">Grade ${currentStudent.grade}-${currentStudent.section} | Roll #${currentStudent.rollNo}</div>
            </div>
          </div>

          <!-- 11 Subject Scores -->
          <div class="space-y-3">
            <h3 class="text-base font-bold text-slate-900">Your 11 Core Subjects Performance</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${CORE_SUBJECTS.map(sub => {
                const score = currentStudent.marks ? (currentStudent.marks[sub] || 0) : 0;
                return `
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-800">${sub}</span>
                    <span class="text-xs font-extrabold text-slate-900 font-mono">${score}%</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachStudentEvents() {
    const dropdown = document.getElementById("student-selector-dropdown");
    if (dropdown) {
      dropdown.addEventListener("change", (e) => {
        this.currentStudentId = e.target.value;
        this.render();
      });
    }
  }

  // ==========================================
  // MODALS & ADMISSION ENGINE LOGIC
  // ==========================================

  openAdmissionModal() {
    const modal = document.getElementById("admission-modal");
    if (modal) {
      modal.classList.remove("hidden");
      this.updateAdmissionFormDiscountPreview();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  updateAdmissionFormDiscountPreview() {
    const childRows = document.querySelectorAll(".child-admission-row");
    const count = childRows.length;
    const discountRate = calculateDiscountRate(count);
    
    const previewEl = document.getElementById("admission-discount-preview");
    if (previewEl) {
      previewEl.innerHTML = `
        <div class="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900 font-bold flex items-center justify-between">
          <span>Enrolling ${count} ${count === 1 ? "Child" : "Siblings"}:</span>
          <span class="bg-purple-600 text-white px-2.5 py-1 rounded-md">
            ${discountRate}% Automatic Sibling Discount Applied
          </span>
        </div>
      `;
    }
  }

  async handleAdmissionSubmit(e) {
    e.preventDefault();
    const parentName = document.getElementById("adm-parent-name").value;
    const parentEmail = document.getElementById("adm-parent-email").value;
    const parentPhone = document.getElementById("adm-parent-phone").value;
    const parentId = document.getElementById("adm-parent-id").value;

    const childNames = document.querySelectorAll(".adm-child-name");
    const childGrades = document.querySelectorAll(".adm-child-grade");
    const childPhotoInputs = document.querySelectorAll(".adm-child-photo");

    const childrenPromises = [];
    childNames.forEach((input, i) => {
      if (input.value.trim() !== "") {
        const name = input.value;
        const grade = Number(childGrades[i].value);
        const photoFile = childPhotoInputs[i] && childPhotoInputs[i].files[0];

        if (photoFile) {
          childrenPromises.push(new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
              resolve({
                name,
                grade,
                section: "A",
                rollNo: String(Math.floor(Math.random() * 800) + 100),
                avatar: evt.target.result
              });
            };
            reader.readAsDataURL(photoFile);
          }));
        } else {
          childrenPromises.push(Promise.resolve({
            name,
            grade,
            section: "A",
            rollNo: String(Math.floor(Math.random() * 800) + 100)
          }));
        }
      }
    });

    const children = await Promise.all(childrenPromises);

    if (children.length === 0) {
      alert("Please enter at least one child details.");
      return;
    }

    this.store.addFamilyAdmission({
      parentName,
      parentEmail,
      parentPhone,
      parentId,
      children
    });

    this.closeModal("admission-modal");
    this.render();
    this.showToast(`Admitted ${children.length} student(s) under ${parentName}! Sibling discount auto-updated.`, "success");
  }

  // Printable Invoice Modal Generator
  openInvoiceModal(stuId) {
    const student = this.store.getStudentById(stuId);
    if (!student) return;

    const modal = document.getElementById("invoice-modal");
    const container = document.getElementById("invoice-modal-content");
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="printable-area space-y-6">
        <!-- Official School Letterhead Header -->
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">ABC SCHOOL</h1>
            <p class="text-xs text-slate-500">Official Monthly Tuition Fee Invoice & Receipt</p>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono font-bold text-slate-700">INVOICE #: INV-${student.id}</div>
            <div class="text-xs text-slate-400">Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Student & Parent Billing Info -->
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-400 uppercase">Billed To:</span>
            <div class="font-bold text-slate-900 mt-1">${student.parentName}</div>
            <div class="text-slate-500">Parent ID: ${student.parentId}</div>
            <div class="text-slate-500">${student.parentPhone}</div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-400 uppercase">Student Profile:</span>
            <div class="font-bold text-slate-900 mt-1">${student.name}</div>
            <div class="text-slate-500">Grade ${student.grade}-${student.section} | Roll #${student.rollNo}</div>
            <div class="text-slate-500">Status: <span class="font-bold text-emerald-600">${student.feeStatus}</span></div>
          </div>
        </div>

        <!-- Itemized Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-900 text-white">
              <tr>
                <th class="py-2.5 px-3">Description</th>
                <th class="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 font-mono">
              <tr>
                <td class="py-2.5 px-3">Monthly Base Tuition Fee (Grade ${student.grade})</td>
                <td class="py-2.5 px-3 text-right">${formatCurrency(student.baseFee)}</td>
              </tr>
              <tr class="text-purple-700 font-bold">
                <td class="py-2.5 px-3">Sibling Discount (${student.discountPercent}% - ${student.siblingCount} Siblings Enrolled)</td>
                <td class="py-2.5 px-3 text-right">-${formatCurrency(student.discountAmount)}</td>
              </tr>
              <tr class="bg-slate-100 font-extrabold text-slate-900 text-sm">
                <td class="py-3 px-3">Net Payable Monthly Total:</td>
                <td class="py-3 px-3 text-right text-emerald-700">${formatCurrency(student.netFee)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Seal -->
        <div class="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Computer generated official invoice by ABC School Management System. Valid without signature.
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  }

  // Printable Report Card Modal Generator
  openReportCardModal(stuId) {
    const student = this.store.getStudentById(stuId);
    if (!student) return;

    const modal = document.getElementById("report-modal");
    const container = document.getElementById("report-modal-content");
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="printable-area space-y-6">
        <div class="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 uppercase">ABC SCHOOL</h1>
            <p class="text-xs text-slate-500">Official 11-Subject Academic Progress Report</p>
          </div>
          <div class="text-right">
            <div class="text-xs font-bold text-slate-800">Academic Year 2026</div>
            <div class="text-xs text-slate-400">Grade ${student.grade} - Section ${student.section}</div>
          </div>
        </div>

        <!-- Student Info Bar -->
        <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div><span class="text-slate-400">Student Name:</span> <strong class="text-slate-900 block">${student.name}</strong></div>
          <div><span class="text-slate-400">Roll Number:</span> <strong class="text-slate-900 block">${student.rollNo}</strong></div>
          <div><span class="text-slate-400">Overall Grade:</span> <strong class="text-emerald-700 block text-sm">${student.overallPercentage}% (${getGradeLetter(student.overallPercentage).letter})</strong></div>
        </div>

        <!-- 11 Subjects Table -->
        <table class="w-full text-left text-xs border border-slate-300">
          <thead class="bg-slate-900 text-white font-bold">
            <tr>
              <th class="p-2 border">#</th>
              <th class="p-2 border">Core Subject</th>
              <th class="p-2 border text-center">Max</th>
              <th class="p-2 border text-center">Obtained</th>
              <th class="p-2 border text-center">Grade</th>
            </tr>
          </thead>
          <tbody class="divide-y font-mono">
            ${CORE_SUBJECTS.map((sub, idx) => {
              const score = student.marks ? (student.marks[sub] || 0) : 0;
              const g = getGradeLetter(score);
              return `
                <tr>
                  <td class="p-2 border">${idx + 1}</td>
                  <td class="p-2 border font-sans font-bold text-slate-900">${sub}</td>
                  <td class="p-2 border text-center">100</td>
                  <td class="p-2 border text-center font-bold">${score}</td>
                  <td class="p-2 border text-center font-bold">${g.letter}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <strong class="text-slate-700">Teacher Remarks:</strong> "${student.teacherNotes}"
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  }

  // Pay Online Simulation Modal
  openPayOnlineModal(stuId) {
    const student = this.store.getStudentById(stuId);
    if (!student) return;

    if (confirm(`Simulate online fee payment of ${formatCurrency(student.netFee)} for ${student.name}?`)) {
      this.store.toggleFeeStatus(stuId);
      this.render();
      this.showToast(`Payment of ${formatCurrency(student.netFee)} processed successfully for ${student.name}! Invoice marked as Paid.`, "success");
    }
  }

  // Photo Upload Trigger & File Reader
  attachPhotoUploadEvents() {
    document.querySelectorAll("[data-upload-photo]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const stuId = e.currentTarget.dataset.uploadPhoto;
        this.triggerPhotoUpload(stuId);
      });
    });
  }

  triggerPhotoUpload(studentId) {
    const student = this.store.getStudentById(studentId);
    if (!student) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target.result;
          this.store.updateStudentAvatar(studentId, dataUrl);
          this.render();
          this.showToast(`Updated picture for ${student.name}!`, "success");
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  // Helper Toast Notification
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold text-white transition-all transform animate-pop-in ${
      type === "success" ? "bg-emerald-600" : type === "warning" ? "bg-amber-600" : "bg-slate-900"
    }`;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
}

// Initialize App on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new SchoolApp();
});
