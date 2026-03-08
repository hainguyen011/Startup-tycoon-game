
import { Language } from "./types";

export const translations = {
  en: {
    common: {
      male: "Male",
      female: "Female",
      other: "Other",
      back: "Back",
      confirm: "Confirm",
      cancel: "Cancel",
      close: "Close",
      save: "Save",
      loading: "Loading...",
      unassigned: "Unassigned",
    },
    setup: {
      title: "Startup Tycoon AI",
      subtitle: "Build the next Silicon Valley empire. Simulated by AI.",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "Enter your API Key...",
      apiKeyNote: "Required to run the simulation.",
      tabs: {
          company: "Company",
          ceo: "CEO Profile"
      },
      companyName: "Company Name",
      companyPlaceholder: "e.g. Pied Piper...",
      productName: "First Product",
      productNamePlaceholder: "e.g. Compression App...",
      productDesc: "Product Description",
      productDescPlaceholder: "What problem does it solve? (Keep it short)",
      industry: "Select Industry",
      startBtn: "Launch Startup ($10,000 Capital)",
      analyzing: "ANALYZING MARKET...",
      industries: {
          tech: { label: "Tech SaaS", desc: "High Risk, High Reward" },
          health: { label: "BioTech", desc: "Long R&D, Big Exit" },
          ai: { label: "AI & ML", desc: "Trending & Expensive" },
          edtech: { label: "EdTech", desc: "Stable Growth" },
          fmcg: { label: "Retail", desc: "Volume Game" }
      },
      aiConfig: "AI Configuration",
      apiKeyRequired: "Requires valid API Key.",
      ceo: {
          name: "Full Name",
          namePlaceholder: "e.g. Richard Hendricks...",
          gender: "Gender",
          genders: {
              male: "Male",
              female: "Female",
              other: "Other"
          },
          interests: "Interests / Hobbies",
          interestsPlaceholder: "e.g. Coding, Music, Gaming (Comma separated)..."
      }
    },
    dashboard: {
      week: "WEEK",
      available: "Available",
      endWeek: "End Week",
      resolveAlert: "Resolve Alert First",
      reputation: "Corporate Reputation",
      ops: "Operations",
      admin: "Administration",
      chat: {
        typing: "Typing...",
        placeholder: "Type a message..."
      },
      funding: {
        title: "External Funding",
        pitch: "Pitch Investors",
        seed: "Seed Round ($200k)",
        seriesA: "Series A ($1M)",
        seriesB: "Series B ($5M)"
      },
      tabs: {
        overview: "Overview",
        office: "Office",
        products: "Products",
        report: "Report",
        secretary: "Secretary",
        team: "Team",
        infra: "Infra",
        founder: "Founder",
        contracts: "Contracts",
        investment: "Investment",
        council: "AI Council"
      },
      products: {
        title: "Product Portfolio",
        techDebt: "Technical Debt",
        modulesTitle: "Technical Modules",
        unassigned: "Unassigned",
        newProduct: "New Product",
        launchNewProduct: "Launch New Product",
        startDev: "Start Development",
        monthlyRevenue: "Monthly Revenue",
        devProgress: "Dev Progress",
        quality: "Quality",
        modules: {
          core: "Core Engine",
          ui: "User Interface",
          db: "Database Schema"
        }
      },
      stats: {
        funds: "Funds",
        users: "Active Users",
        morale: "Team Morale",
        products: "Products",
        netProfit: "Net Profit/Loss",
        runway: "Runway",
        months: "Months",
        burnRate: "Burn Rate",
        teamEff: "Team Efficiency",
        headcount: "Headcount",
        avgSkill: "Avg Skill",
        stress: "Stress Level",
        companyAge: "Company Age",
        stage: "Current Stage",
        valuation: "Est. Valuation",
        growth: "Growth Trajectory",
        marketShare: "Market Share",
        competitor: "Key Competitor",
        health: "Company Health",
        avgStress: "Avg Stress"
      },
      actions: {
        pitch: "Pitch",
        recruit: "Headhunt ($500)",
        upgrade: "Upgrade",
        hire: "Hire",
        fire: "Fire",
        viewCV: "View CV",
        close: "Close",
        launch: "Launch",
        cancel: "Cancel",
        newProduct: "New Product",
        startNewProduct: "Start New Product",
        findContracts: "Find Contracts",
        negotiate: "Negotiate",
        accept: "Accept",
        reject: "Reject",
        askAdvice: "Ask Advice",
        reqAdvice: "Request Advice",
        chat: "Chat",
        findInvestors: "Find Investors",
        boardAdvice: "Board Advice",
        negotiateDeal: "Negotiate Deal",
        resolveEvent: "Resolve Event",
        endTurn: "End Week"
      },
      event: {
        priorityAlert: "Priority Alert",
        ignore: "Ignore & Continue"
      },

      command: {
        title: "Command Center",
        intel: "Intelligence Network",
        strategy: "Strategy Override",
        strategyPlaceholder: "Enter specific instructions for the AI...",
        funding: "Funding Pitch",
        rdFocus: "R&D Focus",
        mktFocus: "Marketing Focus",
        workMode: "Work Mode",
        welfare: "Welfare",
        rdOptions: {
            core: "Core Feature Upgrade",
            stability: "Bugs & Stability",
            research: "R&D New Tech (AI)",
            none: "Do Nothing / Pause"
        },
        mktOptions: {
            ads: "Social Media Ads",
            content: "Content Marketing (SEO)",
            influencer: "Influencer/KOL",
            none: "Do Nothing / Pause"
        },
        workModes: {
            standard: "Standard",
            crunch: "Crunch Mode",
            leisure: "Leisure Mode"
        },
        welfareLevels: {
            minimal: "Minimal",
            standard: "Standard",
            premium: "Premium"
        },
        ceoNote: "CEO Note",
        ceoNotePlaceholder: "E.g. Focus on quality over speed..."
      },
      directiveSelector: {
          back: "Back",
          placeholder: "Enter your instruction...",
          custom: "Custom Directive..."
      },
      intel: {
        market: "Market Research",
        competitor: "Spy Competitor",
        internal: "Internal Audit",
        market_report: "Market Report",
        spy_report: "Spy Report",
        audit_report: "Internal Audit Report",
        title: "Intel Report",
        briefing: "Top Secret",
        source: "Source",
        reliability: "Reliability",
        eyesOnly: "Eyes Only",
        burnAfterReading: "Burn After Reading",
        confidential: "Confidential",
        close: "Close Intelligence"
      },
      stages: {
        prelaunch: "Pre-Launch",
        mvp: "MVP",
        growth: "Growth",
        scaleup: "Scale-Up",
        unicorn: "Unicorn",
        exit: "Exit"
      },
      contracts: {
        active: "Active Contracts",
        available: "Available Contracts",
        findNew: "Find New Contracts",
        weeksLeft: "weeks left",
        completion: "Completion",
        assignStaff: "Assign Staff",
        accept: "Accept Contract",
        reputation: "Corporate Reputation",
        assign: "Assign Staff",
        deadline: "Weeks Left",
        reward: "Reward",
        penalty: "Penalty",
        effort: "Progress",
        completed: "COMPLETED",
        failed: "FAILED",
        noActive: "No active contracts",
        opportunities: "Available Opportunities"
      },
      investment: {
        activeInvestors: "Board of Directors",
        opportunities: "Investment Opportunities",
        negotiation: "Deal Negotiation",
        valuation: "Valuation",
        equity: "Equity",
        offer: "Offer",
        turnsLeft: "Turns Left",
        chatPlaceholder: "Counter-offer (e.g., 'I want $2M for 10%')...",
        estValuation: "Estimated Valuation",
        investor: "Investor",
        patience: "Patience",
        dealClosed: "DEAL CLOSED",
        dealFailed: "NEGOTIATION FAILED",
        partner: "PARTNER",
        rejected: "REJECTED"
      },
      team: {
        manage: "Manage Team",
        recruit: "Recruit",
        recruitTitle: "Recruit New Talent",
        rolePlaceholder: "e.g. Senior Backend Developer...",
        roles: {
            developer: "Developer",
            designer: "Designer",
            marketer: "Marketer",
            sales: "Sales",
            manager: "Manager",
            secretary: "Secretary",
            tester: "Tester"
        },
        headhunting: "Headhunting Params",
        roleDesc: "Role Description",
        maxBudget: "Max Budget",
        findCandidates: "Find Candidates",
        viewProfile: "View Profile",
        wage: "Wage",
        morale: "Morale",
        skill: "Core Skill",
        coreSkills: {
            technical: "Technical",
            creative: "Creative",
            social: "Social",
            critical: "Critical"
        },
        proStats: {
            productivity: "Productivity",
            accuracy: "Accuracy",
            reliability: "Reliability",
            growthPotential: "Growth Potential"
        },
        hrActions: {
            checkRef: "Check Reference ($50)",
            trial: "Hire on Trial (50% pay, 2 weeks)"
        },
        interviewNotes: "Interview Notes",
        hireNow: "Hire Now",
        pass: "Pass",
        chat: "Chat",
        fire: "Fire",
        ask: "Expected",
        statuses: {
            coding_backend: "💻 Backend Dev",
            designing_ui: "🎨 Designing UI",
            querying_db: "🗄️ Querying DB",
            contract_work: "📑 Contract Work",
            coffee_time: "☕ Coffee Break",
            burnout: "🤯 Burnout!",
            idle: "💤 Idle"
        }
      },
      founder: {
          skills: {
              mgmt: "Management",
              tech: "Technical",
              charisma: "Charisma"
          },
          interests: "Personal Interests",
          noInterests: "No interests listed",
          narrative: "Founder Narrative",
          role: "Chief Executive Officer",
          title: "Chief Executive Officer",
          bioTemplate: "As the founder of {company}, {name} brings a vision to disrupt the {industry} industry. With a passion for {interests}, the goal is to build a sustainable unicorn empire."
      },
      council: {
          title: "The Council",
          subtitle: "Your elite team of specialized AI advisors.",
          specialty: "Specialty"
      },
      infra: {
          maxed: "Maxed Out",
          upgrade: "Upgrade",
          level: "Level",
          office: {
              name: "Home Office / Garage",
              benefit: "Capacity: {value} Employees"
          },
          server: {
              name: "Shared Servers",
              benefit: "Capacity: {value} Users"
          },
          pc: {
              name: "High-end Workstations",
              benefit: "Boosts Productivity by {value}%"
          },
          chair: {
              name: "Ergonomic Chairs",
              benefit: "Boosts Reliability by {value}%"
          },
          coffee: {
              name: "Premium Coffee Machine",
              benefit: "Reduces weekly Stress by {value}"
          },
          breakdown: "[BREAKDOWN] {name} has malfunctioned! Level dropped to {level}.",
          toxic: "[CULTURE] The office vibe feels toxic recently.",
          harmony: "[CULTURE] Great team harmony today!"
      }
    },
    gameover: {
      title: "Game Over",
      victory: "Unicorn Status!",
      reason: "Your startup has ceased operations.",
      restart: "Play Again",
      finalUsers: "Final Users",
      equityKept: "Equity Kept"
    },
    market: {
        bull: "BULL MARKET",
        bear: "BEAR MARKET",
        stable: "STABLE"
    },
    alerts: {
        apiKeyRequired: "Please enter API Key to start!",
        quotaExceeded: "API Key quota exceeded. Please check billing/credits.",
        invalidKey: "Invalid API Key.",
        tooManyRequests: "Too many requests or quota exceeded (429).",
        officeFull: "Office is full!",
        noFundsRecruit: "Not enough funds ($500)!",
        noFundsHire: "Not enough funds to hire!",
        errorTurn: "Error processing turn. Please try again.",
        systemError: "System Error. Please check API Key or Network.",
        bankrupt: "Bankrupt (Debt > $10k).",
        systemFailure: "System Failure"
    },
    history: {
        investmentDeal: "Investment Deal Closed! {name} invested ${amount} for {equity}% equity.",
        pitchSecured: "FUNDING SECURED!",
        pitchRejected: "PITCH REJECTED.",
        expandAggressively: "Expand aggressively.",
        spendWisely: "Spend wisely.",
        improveStats: "Improve stats and try again.",
        boardAdvice: "Board Advice: {advice}"
    },
    traits: {
        diligent: "Diligent",
        lazy: "Lazy",
        loyal: "Loyal",
        sensitive: "Sensitive",
        ambitious: "Ambitious",
        sociable: "Sociable",
        eccentric: "Eccentric",
        // Gen Z Vibe
        fastLearner: "Fast Learner",
        bugCrusher: "Bug Crusher",
        ideaMachine: "Idea Machine",
        soloCarry: "Solo Carry",
        teamGlue: "Team Glue",
        toxic: "Toxic",
        burnoutProne: "Burnout Prone",
        codeCowboy: "Code Cowboy",
        quietQuitter: "Quiet Quitter",
        dramaKing: "Drama King/Queen",
        meetingLover: "Meeting Lover"
    }
  },
  vi: {
    common: {
      male: "Nam",
      female: "Nữ",
      other: "Khác",
      back: "Quay lại",
      confirm: "Xác nhận",
      cancel: "Hủy",
      close: "Đóng",
      save: "Lưu",
      loading: "Đang tải...",
      unassigned: "Chưa gán",
    },
    setup: {
      title: "Startup Tycoon AI",
      subtitle: "Xây dựng đế chế công nghệ tiếp theo. trải nghiệm hệ thống điều phối thông minh với tính năng AI chuyên nghiệp ",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "Nhập API Key của bạn...",
      apiKeyNote: "Bắt buộc để chạy mô phỏng.",
      tabs: {
          company: "Công ty",
          ceo: "Hồ sơ CEO"
      },
      companyName: "Tên Game / Công Ty",
      companyPlaceholder: "Ví dụ: Pied Piper...",
      productName: "Sản Phẩm Đầu Tiên",
      productNamePlaceholder: "Ví dụ: App nén dữ liệu...",
      productDesc: "Mô tả ngắn",
      productDescPlaceholder: "Sản phẩm giải quyết vấn đề gì? (Ngắn gọn)",
      industry: "Chọn Ngành",
      startBtn: "Khởi Nghiệp ($10,000 vốn)",
      analyzing: "ĐANG PHÂN TÍCH THỊ TRƯỜNG...",
      industries: {
          tech: { label: "Phần mềm (SaaS)", desc: "Rủi ro cao, Lợi nhuận lớn" },
          health: { label: "Y tế & Sinh học", desc: "Nghiên cứu lâu dài, Thoái vốn lớn" },
          ai: { label: "AI & ML", desc: "Xu hướng & Chi phí cao" },
          edtech: { label: "Giáo dục", desc: "Tăng trưởng ổn định" },
          fmcg: { label: "Bán lẻ", desc: "Cuộc chơi về quy mô" }
      },
      aiConfig: "Cấu hình AI",
      apiKeyRequired: "Yêu cầu API Key hợp lệ.",
      ceo: {
          name: "Họ và Tên",
          namePlaceholder: "Ví dụ: Nguyễn Văn A...",
          gender: "Giới tính",
          genders: {
              male: "Nam",
              female: "Nữ",
              other: "Khác"
          },
          interests: "Sở thích / Đam mê",
          interestsPlaceholder: "Ví dụ: Lập trình, Âm nhạc, Golf (Phân cách bằng dấu phẩy)..."
      }
    },
    dashboard: {
      week: "TUẦN",
      available: "Khả dụng",
      endWeek: "Kết thúc tuần",
      resolveAlert: "Xử lý thông báo trước",
      reputation: "Uy tín công ty",
      ops: "Vận hành",
      admin: "Quản trị",
      chat: {
        typing: "Đang nhập...",
        placeholder: "Nhập tin nhắn..."
      },
      funding: {
        title: "Huy động vốn bên ngoài",
        pitch: "Thuyết phục nhà đầu tư",
        seed: "Vòng hạt giống ($200k)",
        seriesA: "Vòng Series A ($1M)",
        seriesB: "Vòng Series B ($5M)"
      },
      tabs: {
        overview: "Tổng quan",
        office: "Văn phòng",
        products: "Sản phẩm",
        report: "Báo cáo",
        secretary: "Thư ký",
        team: "Nhân sự",
        infra: "Hạ tầng",
        founder: "Nhà sáng lập",
        contracts: "Hợp đồng",
        investment: "Đầu tư",
        council: "Hội đồng AI"
      },
      products: {
        title: "Danh mục sản phẩm",
        techDebt: "Nợ kỹ thuật",
        modulesTitle: "Module Kỹ thuật",
        unassigned: "Chưa gán",
        newProduct: "Sản phẩm mới",
        launchNewProduct: "Triển khai sản phẩm mới",
        startDev: "Bắt đầu phát triển",
        monthlyRevenue: "Doanh thu tháng",
        devProgress: "Tiến độ phát triển",
        quality: "Chất lượng",
        modules: {
          core: "Hệ thống lõi",
          ui: "Giao diện người dùng",
          db: "Cấu trúc dữ liệu"
        }
      },
      stats: {
        funds: "Ngân sách",
        users: "Người dùng",
        morale: "Tinh thần",
        products: "Sản phẩm",
        netProfit: "Lợi nhuận ròng",
        runway: "Thời gian hoạt động",
        months: "Tháng",
        burnRate: "Đốt tiền",
        teamEff: "Hiệu suất team",
        headcount: "Số lượng",
        avgSkill: "Kỹ năng TB",
        stress: "Căng thẳng",
        companyAge: "Tuổi đời",
        stage: "Giai đoạn",
        valuation: "Định giá",
        growth: "Biểu đồ tăng trưởng",
        marketShare: "Thị phần",
        competitor: "Đối thủ chính",
        health: "Sức khỏe công ty",
        avgStress: "Căng thẳng TB"
      },
      actions: {
        pitch: "Gọi vốn",
        recruit: "Tuyển dụng ($500)",
        upgrade: "Nâng cấp",
        hire: "Tuyển",
        fire: "Sa thải",
        viewCV: "Xem CV",
        close: "Đóng",
        launch: "Triển khai",
        cancel: "Hủy",
        newProduct: "Sản phẩm mới",
        startNewProduct: "Tạo sản phẩm mới",
        findContracts: "Tìm Hợp Đồng",
        negotiate: "Đàm phán",
        accept: "Chấp nhận",
        reject: "Từ chối",
        askAdvice: "Xin lời khuyên",
        reqAdvice: "Yêu cầu lời khuyên",
        chat: "Trò chuyện",
        findInvestors: "Tìm nhà đầu tư",
        boardAdvice: "Lời khuyên HĐQT",
        negotiateDeal: "Đàm phán thương vụ",
        resolveEvent: "Giải quyết sự kiện",
        endTurn: "Kết thúc tuần"
      },
      event: {
        priorityAlert: "Cảnh báo khẩn cấp",
        ignore: "Bỏ qua & Tiếp tục"
      },

      command: {
        title: "Bàn làm việc của CEO",
        intel: "Mạng lưới thông tin",
        strategy: "Chỉ đạo chiến lược",
        strategyPlaceholder: "Nhập hướng dẫn cụ thể cho AI...",
        funding: "Gọi vốn đầu tư",
        rdFocus: "Trọng tâm R&D",
        mktFocus: "Trọng tâm Marketing",
        workMode: "Chế độ làm việc",
        welfare: "Phúc lợi",
        rdOptions: {
            core: "Nâng cấp tính năng cốt lõi",
            stability: "Sửa lỗi & Ổn định",
            research: "R&D Công nghệ mới (AI)",
            none: "Không làm gì / Tạm dừng"
        },
        mktOptions: {
            ads: "Chạy quảng cáo MXH",
            content: "Content Marketing (SEO)",
            influencer: "Thuê Influencer/KOL",
            none: "Không làm gì / Tạm dừng"
        },
        workModes: {
            standard: "Bình thường",
            crunch: "Tăng tốc (Crunch)",
            leisure: "Thư giãn (Leisure)"
        },
        welfareLevels: {
            minimal: "Tối giản",
            standard: "Cơ bản",
            premium: "Cao cấp"
        },
        ceoNote: "Ghi chú của CEO",
        ceoNotePlaceholder: "VD: Tập trung vào chất lượng hơn tốc độ..."
      },
      directiveSelector: {
          back: "Quay lại",
          placeholder: "Nhập chỉ thị của bạn...",
          custom: "Tùy chỉnh chỉ thị..."
      },
      intel: {
        market: "Nghiên cứu thị trường",
        competitor: "Do thám đối thủ",
        internal: "Kiểm toán nội bộ",
        market_report: "Báo cáo thị trường",
        spy_report: "Báo cáo tình báo",
        audit_report: "Báo cáo kiểm toán",
        title: "Báo cáo tình báo",
        briefing: "Tối mật",
        source: "Nguồn",
        reliability: "Độ tin cậy",
        eyesOnly: "Chỉ dành cho cấp quản lý",
        burnAfterReading: "Tiêu hủy sau khi đọc",
        confidential: "Bảo mật",
        close: "Đóng báo cáo"
      },

      contracts: {
        active: "Hợp đồng đang chạy",
        available: "Hợp đồng khả dụng",
        findNew: "Tìm hợp đồng mới",
        weeksLeft: "tuần còn lại",
        completion: "Hoàn thành",
        assignStaff: "Gán nhân sự",
        accept: "Chấp nhận hợp đồng",
        reputation: "Uy tín doanh nghiệp",
        assign: "Gán nhân sự",
        deadline: "Tuần còn lại",
        reward: "Thù lao",
        penalty: "Phạt",
        effort: "Tiến độ",
        completed: "HOÀN THÀNH",
        failed: "THẤT BẠI",
        noActive: "Không có hợp đồng nào",
        opportunities: "Cơ hội khả dụng"
      },
      investment: {
        activeInvestors: "Hội đồng quản trị",
        opportunities: "Cơ hội đầu tư",
        negotiation: "Đàm phán thương vụ",
        valuation: "Định giá công ty",
        equity: "Cổ phần",
        offer: "Đề nghị",
        turnsLeft: "Lượt đàm phán",
        chatPlaceholder: "Đưa ra đề nghị (VD: Tôi muốn $2M cho 10%)...",
        estValuation: "Định giá ước tính",
        investor: "Nhà đầu tư",
        patience: "Sự kiên nhẫn",
        dealClosed: "THƯƠNG VỤ HOÀN TẤT",
        dealFailed: "ĐÀM PHÁN THẤT BẠI",
        partner: "ĐỐI TÁC",
        rejected: "BỊ TỪ CHỐI"
      },
      team: {
        manage: "Quản lý nhân sự",
        recruit: "Tuyển dụng",
        recruitTitle: "Tuyển dụng nhân tài",
        rolePlaceholder: "VD: Lập trình viên Backend...",
        roles: {
            developer: "Lập trình viên",
            designer: "Thiết kế",
            marketer: "Marketing",
            sales: "Kinh doanh",
            manager: "Quản lý",
            secretary: "Thư ký",
            tester: "Kiểm thử"
        },
        headhunting: "Thông số tuyển dụng",
        roleDesc: "Mô tả vị trí",
        maxBudget: "Ngân sách tối đa",
        findCandidates: "Tìm ứng viên",
        viewProfile: "Xem hồ sơ",
        wage: "Lương",
        morale: "Tinh thần",
        skill: "Kỹ năng chính",
        coreSkills: {
            technical: "Thực thi (Tech)",
            creative: "Sáng tạo",
            social: "Giao tiếp",
            critical: "Tư duy"
        },
        proStats: {
            productivity: "Năng suất (⚡)",
            accuracy: "Độ chính xác (🎯)",
            reliability: "Độ tin cậy (🛡️)",
            growthPotential: "Tiềm năng (🌱)"
        },
        hrActions: {
            checkRef: "Check Var sếp cũ ($50)",
            trial: "Thử việc (2 tuần, lương 50%)"
        },
        interviewNotes: "Ghi chú phỏng vấn",
        hireNow: "Tuyển ngay",
        pass: "Bỏ qua",
        chat: "Trò chuyện",
        fire: "Sa thải",
        ask: "Lương đề nghị",
        statuses: {
            coding_backend: "💻 Lập trình Hệ thống",
            designing_ui: "🎨 Thiết kế Giao diện",
            querying_db: "🗄️ Tối ưu Dữ liệu",
            contract_work: "📑 Giải quyết Hợp đồng",
            coffee_time: "☕ Giờ Cà phê",
            burnout: "🤯 Kiệt sức!",
            idle: "💤 Đang chờ"
        }
      },
      founder: {
          skills: {
              mgmt: "Quản lý",
              tech: "Kỹ thuật",
              charisma: "Sức hút"
          },
          interests: "Sở thích cá nhân",
          noInterests: "Chưa liệt kê sở thích",
          narrative: "Tiểu sử Founder",
          role: "Giám đốc điều hành",
          title: "Giám đốc điều hành (CEO)",
          bioTemplate: "Là người sáng lập {company}, {name} mang theo tầm nhìn thay đổi ngành {industry}. Với đam mê dành cho {interests}, mục tiêu là xây dựng một đế chế kỳ lân bền vững."
      },
      stages: {
        prelaunch: "Sơ khai",
        mvp: "MVP",
        growth: "Tăng trưởng",
        scaleup: "Mở rộng",
        unicorn: "Kỳ lân",
        exit: "Thoái vốn"
      },
      council: {
          title: "Hội đồng AI",
          subtitle: "Đội ngũ cố vấn AI chuyên biệt của bạn.",
          specialty: "Chuyên môn"
      },
      infra: {
          maxed: "Cấp tối đa",
          upgrade: "Nâng cấp",
          level: "Cấp",
          office: {
              name: "Văn phòng tại gia / Garage",
              benefit: "Sức chứa: {value} nhân viên"
          },
          server: {
              name: "Máy chủ dùng chung",
              benefit: "Sức chứa: {value} người dùng"
          },
          pc: {
              name: "Dàn PC Khủng",
              benefit: "Tăng Năng suất (Productivity): +{value}%"
          },
          chair: {
              name: "Ghế Công Thái Học",
              benefit: "Tăng Độ Ổn định (Reliability): +{value}%"
          },
          coffee: {
              name: "Máy Pha Cà Phê Xịn",
              benefit: "Giảm Stress mỗi tuần: -{value}"
          },
          breakdown: "[SỰ CỐ] {name} bị hỏng hóc! Cấp độ giảm xuống {level}.",
          toxic: "[VĂN HÓA] Không khí văn phòng dạo này khá 'toxic'.",
          harmony: "[VĂN HÓA] Sự gắn kết đội ngũ thật tuyệt vời!"
      }
    },
    gameover: {
      title: "Game Over",
      victory: "Kỳ Lân Công Nghệ!",
      reason: "Startup của bạn đã dừng bước.",
      restart: "Chơi lại từ đầu",
      finalUsers: "Người dùng cuối",
      equityKept: "Cổ phần còn lại"
    },
    market: {
        bull: "THỊ TRƯỜNG TĂNG",
        bear: "THỊ TRƯỜNG GIẢM",
        stable: "ỔN ĐỊNH"
    },
    alerts: {
        apiKeyRequired: "Vui lòng nhập API Key để bắt đầu!",
        quotaExceeded: "API Key đã hết hạn mức sử dụng (Quota). Vui lòng kiểm tra billing hoặc nạp thêm credit.",
        invalidKey: "API Key không hợp lệ.",
        tooManyRequests: "Yêu cầu quá nhanh hoặc hết hạn mức (429).",
        officeFull: "Văn phòng đã đầy!",
        noFundsRecruit: "Không đủ tiền ($500)!",
        noFundsHire: "Không đủ tiền tuyển dụng!",
        errorTurn: "Có lỗi khi xử lý lượt chơi. Vui lòng thử lại.",
        systemError: "Lỗi hệ thống. Vui lòng kiểm tra API Key hoặc kết nối mạng.",
        bankrupt: "Phá sản (Nợ > $10k).",
        systemFailure: "Lỗi hệ thống"
    },
    history: {
        investmentDeal: "Thương vụ hoàn tất! {name} đã đầu tư ${amount} cho {equity}% cổ phần.",
        pitchSecured: "HUY ĐỘNG VỐN THÀNH CÔNG!",
        pitchRejected: "BỊ TỪ CHỐI.",
        expandAggressively: "Mở rộng mạnh mẽ.",
        spendWisely: "Chi tiêu khôn ngoan.",
        improveStats: "Cải thiện chỉ số và thử lại.",
        boardAdvice: "Lời khuyên HĐQT: {advice}"
    },
    traits: {
        diligent: "Siêng năng",
        lazy: "Lười biếng",
        loyal: "Trung thành",
        sensitive: "Dễ tự ái",
        ambitious: "Tham vọng",
        sociable: "Hòa đồng",
        eccentric: "Lập dị",
        fastLearner: "Biết tuốt mảng mới",
        bugCrusher: "Hủy diệt Bug",
        ideaMachine: "Máy đẻ Idea",
        soloCarry: "Gánh team còng lưng",
        teamGlue: "Đá tảng kết nối",
        toxic: "Mỏ hỗn / Mỏ hỗn",
        burnoutProne: "Chúa tể suy",
        codeCowboy: "Múa phím rớt não",
        quietQuitter: "Làm đủ ăn rồi cút",
        dramaKing: "Chiến thần hít Drama",
        meetingLover: "Tôn vương Họp hành"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
