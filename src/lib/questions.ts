/**
 * Quiz Questions Data - Tin học Lớp 4 - Chủ đề PowerPoint
 * Bài 7, 8, 9 (SGK Tin học 4 Kết nối tri thức)
 */

import type { Question } from './types';

export const quizQuestions: Question[] = [
    {
        id: 1,
        question: "Để gõ được tiếng Việt trên máy tính, em cần sử dụng phần mềm hỗ trợ nào sau đây?",
        options: ["Paint", "Unikey", "PowerPoint", "Windows Media Player"],
        answer: 1,
        explanation: "Unikey là phần mềm gõ tiếng Việt phổ biến.",
        hint: "💡 Phần mềm này có biểu tượng chữ V màu đỏ trên thanh taskbar.",
        image: "/images/q1.png"
    },
    {
        id: 2,
        question: "Trong kiểu gõ Telex, để gõ chữ \"â\", em cần gõ những phím nào?",
        options: ["aw", "aa", "dd", "ee"],
        answer: 1,
        explanation: "Telex: aa = â.",
        hint: "💡 Telex: Gõ cùng một phím hai lần để thêm dấu mũ.",
        image: "/images/q2.png"
    },
    {
        id: 3,
        question: "Trong kiểu gõ Telex, phím nào được dùng để gõ dấu sắc?",
        options: ["Phím s", "Phím f", "Phím r", "Phím j"],
        answer: 0,
        explanation: "Telex: s = sắc.",
        hint: "💡 Dấu này giống chữ cái đầu tiên của từ 'sắc'.",
        image: "/images/q3.png"
    },
    {
        id: 4,
        question: "Để lưu bài trình chiếu vào thư mục trên máy tính, em chọn lệnh nào trong bảng chọn File?",
        options: ["Open", "New", "Save", "Print"],
        answer: 2,
        explanation: "Save = Lưu.",
        hint: "💡 Từ tiếng Anh có nghĩa là 'lưu giữ, cứu'.",
        image: "/images/q4.png"
    },
    {
        id: 5,
        question: "Để gõ chữ hoa (Ví dụ: A, B, C), em cần nhấn giữ phím nào đồng thời khi gõ phím chữ?",
        options: ["Ctrl", "Alt", "Shift", "Tab"],
        answer: 2,
        explanation: "Shift + phím chữ = Chữ hoa.",
        hint: "💡 Phím này nằm ở góc trái bàn phím, có mũi tên hướng lên.",
        image: "/images/q5.png"
    },
    {
        id: 6,
        question: "Các công cụ định dạng văn bản như phông chữ, cỡ chữ, màu chữ nằm trong thẻ lệnh nào?",
        options: ["Insert", "Design", "Home", "Transitions"],
        answer: 2,
        explanation: "Các công cụ định dạng nằm ở thẻ Home.",
        hint: "💡 Thẻ này là thẻ đầu tiên, có nghĩa là 'trang chủ'.",
        image: "/images/q6.png"
    },
    {
        id: 7,
        question: "Nút lệnh có chữ B đậm trong nhóm lệnh Font dùng để làm gì?",
        options: ["Tạo chữ nghiêng", "Tạo chữ đậm", "Tạo chữ gạch chân", "Thay đổi màu chữ"],
        answer: 1,
        explanation: "B (Bold) = Đậm.",
        hint: "💡 Chữ B trong tiếng Anh là viết tắt của 'Bold'.",
        image: "/images/q7.png"
    },
    {
        id: 8,
        question: "Để tạo danh sách liệt kê có dấu gạch đầu dòng (Bullets), em sử dụng nút lệnh nào?",
        options: ["Nút số thứ tự", "Nút Bullets (•)", "Nút căn giữa", "Nút in đậm"],
        answer: 1,
        explanation: "Nút Bullets tạo gạch đầu dòng.",
        hint: "💡 Nút này có biểu tượng các chấm tròn (•) đầu dòng.",
        image: "/images/q8.png"
    },
    {
        id: 9,
        question: "Việc định dạng văn bản trên trang chiếu có mục đích gì?",
        options: [
            "Làm cho trang chiếu khó đọc hơn.",
            "Giúp trang chiếu đẹp, dễ đọc và nổi bật nội dung.",
            "Chỉ để trang trí cho vui mắt.",
            "Để máy tính chạy nhanh hơn."
        ],
        answer: 1,
        explanation: "Định dạng giúp nội dung đẹp và dễ đọc.",
        hint: "💡 Mục đích chính là giúp người xem dễ hiểu hơn.",
        image: "/images/q9.png"
    },
    {
        id: 10,
        question: "Bước đầu tiên trước khi định dạng một đoạn văn bản là gì?",
        options: ["Nhấn nút Save", "Chọn (bôi đen) đoạn văn bản", "Thoát khỏi phần mềm", "Tắt máy tính"],
        answer: 1,
        explanation: "Phải chọn văn bản trước khi xử lý.",
        hint: "💡 Như khi tô màu, phải chọn vùng cần tô trước.",
        image: "/images/q10.png"
    },
    {
        id: 11,
        question: "Hiệu ứng chuyển trang (Transition) trong bài trình chiếu là gì?",
        options: [
            "Là cách thức các hình ảnh bay lượn.",
            "Là cách thức văn bản xuất hiện.",
            "Là cách thức trang chiếu xuất hiện khi trình chiếu.",
            "Là cách thức âm thanh phát ra."
        ],
        answer: 2,
        explanation: "Chuyển trang là cách trang xuất hiện.",
        hint: "💡 'Transition' nghĩa là sự chuyển đổi giữa các trang.",
        image: "/images/q11.png"
    },
    {
        id: 12,
        question: "Để tạo hiệu ứng chuyển trang, em chọn thẻ lệnh nào?",
        options: ["Home", "Insert", "Transitions", "Animations"],
        answer: 2,
        explanation: "Transitions = Chuyển đổi (trang).",
        hint: "💡 Thẻ có tên giống với từ 'chuyển đổi' trong tiếng Anh.",
        image: "/images/q12.png"
    },
    {
        id: 13,
        question: "Mỗi trang chiếu có thể áp dụng bao nhiêu kiểu hiệu ứng chuyển trang?",
        options: ["Duy nhất một kiểu", "Hai kiểu", "Nhiều kiểu tuỳ thích", "Không giới hạn"],
        answer: 0,
        explanation: "Mỗi trang chỉ nhận 1 hiệu ứng chuyển trang.",
        hint: "💡 Giống như mỗi cửa chỉ có thể mở theo một cách.",
        image: "/images/q13.png"
    },
    {
        id: 14,
        question: "Click nút lệnh nào để bắt đầu trình chiếu từ trang đầu tiên?",
        options: [
            "Nút Play video",
            "Nút Slideshow từ đầu (F5)",
            "Nút Print",
            "Nút Save"
        ],
        answer: 1,
        explanation: "Chọn để trình chiếu toàn màn hình.",
        hint: "💡 Phím tắt F5 cũng làm được điều này.",
        image: "/images/q14.png"
    },
    {
        id: 15,
        question: "Các hiệu ứng như Push, Wipe, Fade nằm trong nhóm lệnh nào của thẻ lệnh Transitions?",
        options: ["Transition to This Slide", "Timing", "Preview", "Sound"],
        answer: 0,
        explanation: "Nhóm \"Transition to This Slide\".",
        hint: "💡 Nhóm này có nghĩa là 'Chuyển đổi đến trang này'.",
        image: "/images/q15.png"
    }
];
