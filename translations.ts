
import { Language } from "./types";

export const translations = {
  en: {
    setup: {
      title: "Startup Tycoon AI",
      subtitle: "Build the next Silicon Valley empire. Simulated by AI.",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "Enter your API Key...",
      apiKeyNote: "Required to run the simulation.",
      companyName: "Company Name",
      companyPlaceholder: "e.g. Pied Piper...",
      productName: "First Product",
      productNamePlaceholder: "e.g. Compression App...",
      productDesc: "Product Description",
      productDescPlaceholder: "What problem does it solve? (Keep it short)",
      industry: "Select Industry",
      startBtn: "Launch Startup ($10,000 Capital)",
      analyzing: "ANALYZING MARKET..."
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
        mktFocus: "Marketing Focus"
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
      companyName: "Tên Công Ty",
      companyPlaceholder: "Ví dụ: Pied Piper...",
      productName: "Sản Phẩm Đầu Tiên",
      productNamePlaceholder: "Ví dụ: App nén dữ liệu...",
      productDesc: "Mô tả sản phẩm",
      productDescPlaceholder: "Sản phẩm giải quyết vấn đề gì? (Ngắn gọn)",
      industry: "Chọn Ngành",
      startBtn: "Khởi Nghiệp ($10,000 vốn)",
      analyzing: "ĐANG PHÂN TÍCH THỊ TRƯỜNG..."
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
        mktFocus: "Trọng tâm Marketing"
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
