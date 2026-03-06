
import { Language } from "./types";

export const translations = {
  en: {
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
      tabs: {
        overview: "Overview",
        products: "Products",
        report: "Report",
        secretary: "Secretary",
        team: "Team",
        infra: "Infra",
        founder: "Founder",
        contracts: "Contracts",
        investment: "Investment"
      },
      products: {
        techDebt: "Technical Debt",
        modulesTitle: "Technical Modules",
        unassigned: "Unassigned",
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
        competitor: "Key Competitor"
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
        askAdvice: "Ask Advice"
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
        }
      },
      directiveSelector: {
          back: "Back",
          placeholder: "Enter your instruction...",
          custom: "Custom Directive..."
      },
      intel: {
        market: "Market Research",
        competitor: "Spy Competitor",
        internal: "Internal Audit"
      },
      contracts: {
        active: "Active Contracts",
        available: "Available Contracts",
        reputation: "Corporate Reputation",
        assign: "Assign Staff",
        deadline: "Weeks Left",
        reward: "Reward",
        penalty: "Penalty",
        effort: "Progress",
        completed: "COMPLETED",
        failed: "FAILED"
      },
      investment: {
        activeInvestors: "Board of Directors",
        opportunities: "Investment Opportunities",
        negotiation: "Deal Negotiation",
        valuation: "Valuation",
        equity: "Equity",
        offer: "Offer",
        turnsLeft: "Turns Left",
        chatPlaceholder: "Counter-offer (e.g., 'I want $2M for 10%')..."
      }
    },
    gameover: {
      title: "Game Over",
      victory: "Unicorn Status!",
      reason: "Your startup has ceased operations.",
      restart: "Play Again"
    }
  },
  vi: {
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
      tabs: {
        overview: "Tổng quan",
        products: "Sản phẩm",
        report: "Báo cáo",
        secretary: "Thư ký",
        team: "Nhân sự",
        infra: "Hạ tầng",
        founder: "Founder",
        contracts: "Hợp đồng",
        investment: "Đầu tư"
      },
      products: {
        techDebt: "Nợ kỹ thuật",
        modulesTitle: "Module Kỹ thuật",
        unassigned: "Chưa gán",
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
        competitor: "Đối thủ chính"
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
        askAdvice: "Xin lời khuyên"
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
        }
      },
      directiveSelector: {
          back: "Quay lại",
          placeholder: "Nhập chỉ thị của bạn...",
          custom: "Tùy chỉnh chỉ thị..."
      },
      intel: {
        market: "Nghiên cứu thị trường",
        competitor: "Do thám đối thủ",
        internal: "Kiểm toán nội bộ"
      },
      contracts: {
        active: "Hợp đồng đang chạy",
        available: "Hợp đồng khả dụng",
        reputation: "Uy tín doanh nghiệp",
        assign: "Gán nhân sự",
        deadline: "Tuần còn lại",
        reward: "Thù lao",
        penalty: "Phạt",
        effort: "Tiến độ",
        completed: "HOÀN THÀNH",
        failed: "THẤT BẠI"
      },
      investment: {
        activeInvestors: "Hội đồng quản trị",
        opportunities: "Cơ hội đầu tư",
        negotiation: "Đàm phán thương vụ",
        valuation: "Định giá công ty",
        equity: "Cổ phần",
        offer: "Đề nghị",
        turnsLeft: "Lượt đàm phán",
        chatPlaceholder: "Đưa ra đề nghị (VD: Tôi muốn $2M cho 10%)..."
      }
    },
    gameover: {
      title: "Game Over",
      victory: "Kỳ Lân Công Nghệ!",
      reason: "Startup của bạn đã dừng bước.",
      restart: "Chơi lại từ đầu"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
