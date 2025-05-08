var db = connect(`mongodb://admin:admin@localhost:27017/admin`)

db = db.getSiblingDB('chatbot_app')

db.createCollection("INTRODUCTION_README")

db.INTRODUCTION_README.insertMany([
  {
    name: "Chatbot Database",
    description: "This database is designed to store and manage data for the chatbot application, including user interactions, configurations, and logs.",
    authors: [
      {
        name: "Mạch Vĩ Kiệt",
        email: "mvkiet21@clc.fitus.edu.vn",
        role: "App Developer"
      },
      {
        name: "Nguyễn Duy Đăng Khoa",
        email: "nddkhoa21@clc.fitus.edu.vn",
        role: "AI Developer"
      }
    ],
    version: "2.0.0",
    created_at: { "$date": "2025-04-11T18:26:59.207Z" }
  }
])

db.createRole(
  {
      role: "admin_chatbot",
      privileges: [
          {
            actions: [
              "find", "insert", "remove", "update", "createCollection", "createIndex",
              "dropCollection", "collMod", "compact", "convertToCapped", "dropIndex",
              "killCursors", "planCacheRead", "planCacheWrite", "validate"
            ],
            resource: { db: "chatbot_app", collection: "" }
          }
        ],
      roles: [ { role: "readWrite", db: "chatbot_app" } ]  // short-hand 
  }
)

db.createUser(
  { 
    user: "admin_chatbot",
    pwd: "admin_chatbot",
    roles: [
      { role: "admin_chatbot", db: "chatbot_app" } 
    ]
  },
)


// ==================== Database Initialization ==================== //
// The following code initializes the database with default data.
// It checks if the collections already exist and drops them if they do.
// Then, it creates the collections again and inserts the default data.
// ================================================================== //

db = db.getSiblingDB('chatbot_app')

const collectionAlreadyInDB = db.getCollectionNames()

// Assuming topics_default is defined elsewhere
if (!collectionAlreadyInDB.includes('topics')) {
  db.createCollection('topics')
  db.topics.insertMany([{
    "_id": ObjectId('672a3ed25f22729bb56dcc77'),
    "direction": "/recruitment",
    "name": "recruitment",
    "collection_name": "Thông Tin Tuyển Dụng",
    "collection_description": "Thông tin chi tiết về quy trình tuyển sinh, bao gồm thời gian, yêu cầu hồ sơ, và hướng dẫn đăng ký cho các chương trình đào tạo.",
    "amount_document": 107,
    "type": "option",
    "createdAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    },
    "updatedAt": {
      "$date": "2025-03-13T16:04:17.574Z"
    }
  },
  {
    "_id": ObjectId('672a3ed25f22729bb56dcc76'),
    "direction": "/student_handbook",
    "name": "student_handbook",
    "collection_name": "Sổ Tay Sinh Viên",
    "collection_description": "Tài liệu hướng dẫn, cung cấp thông tin về quy định, chính sách, tài nguyên và hỗ trợ dành cho sinh viên trong trường học.",
    "amount_document": 5,
    "type": "option",
    "createdAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    },
    "updatedAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    }
  },
  {
    "_id": ObjectId('672a3ed25f22729bb56dcc79'),
    "direction": "/timetable",
    "name": "timetable",
    "collection_name": "Thời Khóa Biểu",
    "collection_description": "Thông tin về thời khóa biểu học tập, bao gồm các môn học, giảng viên, và lịch trình các buổi học trong học kỳ.",
    "amount_document": 96,
    "type": "option",
    "createdAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    },
    "updatedAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    }
  },
  {
    "_id": ObjectId('672a3ed25f22729bb56dcc7a'),
    "direction": "/scholarship",
    "name": "scholarship",
    "collection_name": "Thông Tin Học Bổng",
    "collection_description": "Chi tiết về các chương trình học bổng, tiêu chí xét duyệt, hạn nộp hồ sơ và các lợi ích khi nhận học bổng.",
    "amount_document": 51,
    "type": "option",
    "createdAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    },
    "updatedAt": {
      "$date": "2025-03-13T15:44:11.645Z"
    }
  },
  {
    "_id": ObjectId('672a3ed25f22729bb56dcc7c'),
    "direction": "/events",
    "name": "events",
    "collection_name": "Thông Tin Sự kiện",
    "collection_description": "Thông tin về các sự kiện diễn ra trong trường, bao gồm hội thảo, buổi giao lưu, và các hoạt động ngoại khóa cho sinh viên.",
    "amount_document": 190,
    "type": "option",
    "createdAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    },
    "updatedAt": {
      "$date": "2025-03-26T03:43:53.123Z"
    }
  },
  {
    "_id": ObjectId('672a3ed25f22729bb56dcc7b'),
    "direction": "/academic_affairs",
    "name": "academic_affairs",
    "collection_name": "Nội Quy Trường Học",
    "collection_description": "Thông tin về các vấn đề nội bộ, bao gồm quy định học tập, hỗ trợ sinh viên và các hoạt động kỹ luật.",
    "amount_document": 198,
    "type": "option",
    "createdAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    },
    "updatedAt": {
      "$date": "2024-11-05T13:59:14.201Z"
    }
  },
  {
    "_id": ObjectId('67e3855e06f46d0970548432'),
    "collection_name": "Nghiên cứu khoa học",
    "name": "67e3855e06f46d0970548432",
    "collection_description": "Thông tin về các hướng nghiên cứu khoa học tại Khoa Công nghệ thông tin",
    "amount_document": 7,
    "type": "upload",
    "updatedAt": {
      "$date": "2025-04-08T16:36:50.916Z"
    },
    "createdAt": {
      "$date": "2025-03-26T04:41:02.892Z"
    }
  }])
}

// Assuming recommended_questions is defined elsewhere
if (!collectionAlreadyInDB.includes('recommended_questions')) {
  db.createCollection('recommended_questions')
  db.recommended_questions.insertMany([
    {
      "question": "Tôi có thể tra cứu điểm và bảng điểm ở đâu?",
      "resource": {
        "chosen_collections": "academic_affairs",
        "filter_expressions": {
          "academic_affairs": "",
          "student_handbook": ""
        },
        "context": "Title: Thông báo triển khai tra cứu điểm trên hệ thống quản lý người học Student@VNUHCM-US\nArticle: THÔNG BÁO Về việc triển khai tra cứu điểm trên hệ thống quản lý người học Student@VNUHCM-US\n\nKể từ ngày 03/07/2024, học viên và nghiên cứu sinh (gọi tắt là người học) sẽ tra cứu điểm của các môn học trên hệ thống quản lý người học của Trường tại địa chỉ https://student.hcmus.edu.vn/\n\nHệ thống này hỗ trợ các thông tin về người học gồm: \n- Thông tin cá nhân của người học.\n- Kết quả học tập.\n- Lịch học và lịch thi.\n- Học phí.\n- Các thông báo được gửi riêng đến từng người học tại Trường.\n\nCách thức tra cứu xem chi tiết tại thông báo: https://link.hcmus.edu.vn/tracuudiemStudentVNUHCM-US\n\nNếu có ý kiến góp ý, thắc mắc liên quan đến hệ thống, người học vui lòng gửi email về địa chỉ: InfoServiceSupport@hcmus.edu.vn.\n\n---\n\nBP. Giáo Vụ SĐH, Khoa CNTT\n\nEmail: giaovusdh@fit.hcmus.edu.vn\n\nWebsite: https://www.fit.hcmus.edu.vn/sau-dai-hoc\n\nFacebook: https://www.facebook.com/sdh.fit.hcmus/\n\nTitle: Quy định chung trường KHTN\nArticle: 76 \n 3 60 phút  90 phút  \n≥ 4 60 phút  120 phút  \n \nĐiều 11 . Công tác ch ấm thi k ết thúc h ọc ph ần \n11.2. Các b ảng điểm thi theo m ẫu của trường phải có chữ ký của cán bộ \nchấm thi, có xác nh ận của Trưởng bộ môn hoặc Trưởng Khoa và ph ải được gửi \nvề Phòng Kh ảo thí và ĐBCL, chậm nh ất là 2 tu ần kể từ ngày thi .  \n11.3. Kết quả thi phải được thông báo công khai, rõ ràng đ ến từng sinh \nviên sau k ỳ thi.  \nĐiều 12 . Chấm phúc kh ảo  \n12.1. Đối với bài thi gi ữa kỳ: sinh viên liên h ệ trực tiếp giảng viên gi ảng \ndạy để được giải đáp thắc mắc, khiếu nại. \n12.2. Đối với bài thi k ết thúc học phần: Sinh viên có quy ền đề nghị chấm \nphúc khảo kết quả thi kết thúc học phần. Sinh viên n ộp đơn phúc kh ảo và đóng \nlệ phí phúc kh ảo tại Phòng Kh ảo thí và ĐBCL theo quy đ ịnh của Trường.  \n12.3. Thời hạn chấm phúc kh ảo: trong th ời gian 15 ngày k ể từ ngày hết hạn \nnhận đơn phúc kh ảo, Phòng Kh ảo thí và ĐBCL có trách nhi ệm tổ chức chấm \nphúc khảo và công b ố điểm cho sinh viên.  \n12.4. Điểm phúc kh ảo là kết quả cuối cùng của học phần và phải gửi về các \nđơn vị có liên quan trong vòng 01 tu ần kể từ ngày hoàn t ất công tác ch ấm phúc \nkhảo. \nĐiều 13 . Qu ản lý, lưu tr ữ điểm thi, bài thi  \n13.3. Phòng Kh ảo thí và ĐBCL có trách nhi ệm công b ố điểm cho từng sinh \nviên (thông qua tài kho ản cá nhân c ủa sinh viên).  \n13.4. Bảng điểm thi kết thúc học phần phải được lưu trữ vĩnh viễn tại \nPhòng Đào t ạo, Phòng Kh ảo thí và ĐBCL.  \n13.5. Bài thi đư ợc lưu trữ tại Phòng Kh ảo thí và ĐBCL trong 02 năm k ể từ \nhọc kỳ thi kết thúc học phần. \n \n\nTitle: Quy định chung trường KHTN\nArticle: 117 \n - G\niải Nhì, Ba, Khuy ến khích và các Gi ải phụ (nếu \ncó)  + 3 điểm/lần \n5.3.  Là thành viên đ ội tuyển tham d ự kỳ thi Olympic \n/ kỳ thi học thuật cấp thành tr ở lên; Là thành \nviên của nhóm ho ặc cá nhân đ ạt giải thưởng học \nthuật, sản phẩm nghiên c ứu, sáng tạo, ứng dụng, \nkhởi nghiệp từ cấp thành tr ở lên. + 15 điểm \n5.4.  Là tác giả/đồng tác giả của bài báo khoa h ọc \nđược đăng trên t ạp chí quốc tế uy tín  + 25 điểm/bài \ntại học kỳ được \nđăng bài  \n5.5.  Là tác giả/đồng tác giả của bài báo đư ợc đăng \ntrên các t ạp chí khoa h ọc trong nư ớc có uy tín \nhoặc kỷ yếu hội thảo khoa học cấp quốc gia  + 15 điểm/bài \ntại học kỳ được \nđăng bài  \n5.6.  Đạt được các giải thưởng do các t ổ chức chính \nphủ, phi chính ph ủ, tổ chức đa quốc gia (được \ncấp phép ho ạt động tại Việt Nam) trao t ặng + 10 điểm/giải \nthưởng \nTiêu chí 12: Có tinh th ần vư ợt khó, ph ấn đấu vươn lên trong h ọc tập và cu ộc \nsống \n5.7.  Nhận được học bổng do các t ổ chức có tư cách \npháp nhân trao t ặng vì tinh th ần vượt khó, phấn \nđấu vươn lên trong h ọc tập và cuộc sống hoặc \ncác trường hợp không đư ợc học bổng nhưng \nđược Hội đồng cấp Khoa th ống nhất đề xuất  + 10 điểm/học \nkỳ được trao \ntặng học bổng \nTiêu chí 13: Các trư ờng h ợp có hoàn c ảnh đ ặc biệt \n5.8.  - Mồ côi cả cha lẫn mẹ + 20 điểm/học \nkỳ \n5.9.  - Sinh viên khuy ết tật, khó khăn trong đi l ại và \nsinh hoạt + 10 điểm/học \nkỳ \n\nTitle: Quy định chung trường KHTN\nArticle: 62 \n 4. Khối lượng tối đa được công nh ận, chuyển đổi không vư ợt quá 25% \nkhối lượng học tập tối thiểu của chương trình đào t ạo. \nĐiều 14 .  Học lại và h ọc cải thi ện đi ểm \n1. Học lại  \na) Sinh viên có đi ểm học phần không đ ạt phải đăng ký h ọc lại, điểm lần \nhọc cuối là điểm chính th ức của học phần \nb) Đối với các học phần bắt buộc có điểm học phần dưới năm (5,0) sinh \nviên phải đăng ký h ọc lại.  \nc) Đối với các học phần tự chọn có điểm học phần dưới năm (5,0) sinh \nviên được phép đăng ký h ọc lại học phần đó hoặc chọn học phần khác thay th ế \ntrong số các học phần tự chọn được quy định cho m ỗi chương trình đào t ạo. \n2. Học cải thiện điểm \na) Đối với các học phần đã đạt nhưng mu ốn cải thiện điểm thì sinh viên \nphải đăng ký h ọc lại và nộp học phí theo quy đ ịnh. Đ iểm lần học cuối là điểm \nchính thức của học phần.  \nb) Tùy vào đi ều kiện giảng dạy thực tế đối các các h ọc phần, Trường sẽ \nquy định cụ thể các học phần không đư ợc học cải thiện (nếu có).  \nc) Điểm cải thiện không đư ợc sử dụng vào việc tính điểm trung bình h ọc \nkỳ để xét học bổng khuyến khích h ọc tập nhưng đư ợc tính vào đi ểm trung bình \nvà điểm trung bình tích lũy.  \nĐiều 15 .  Đánh giá k ết qu ả học tập theo h ọc kỳ, năm h ọc, khóa h ọc \n1. Kết quả học tập của sinh viên đư ợc đánh giá sau t ừng học kỳ, sau từng \nnăm học, hoặc khóa học của các học phần nằm trong yêu c ầu của chương trình \nđào tạo mà sinh viên đã h ọc tương ứng với hai cách tính đi ểm trung bình như \nsau:  \na) Điểm trung bình: là đi ểm trung bình c ủa những học phần mà sinh \nviên đã h ọc trong m ột học kỳ, trong m ột năm học hoặc tính từ đầu khóa học \nđược tính theo đi ểm chính th ức của học phần và trọng số là số tín chỉ của học \nphần đó . \nb) Điểm trung bình tích lũy: là đi ểm trung bình c ủa những học phần mà \n\n"
      },
    },
    {
      "question": "Cho tôi biết danh sách học bổng khuyến học mới nhất.",
      "resource": {
        "chosen_collections": "scholarship",
        "filter_expressions": {
          "scholarship": "",
          "student_handbook": ""
        },
        "context": "Title: Danh sách dự kiến cấp xét học bổng tân sinh viên Khóa 2024\nArticle: 1. Căn cứ xét học bổng:  \n   Căn cứ Quyết định số 622/QĐ-KHTN về việc ban hành Quy định về chính sách học bổng dành cho sinh viên: https://link.hcmus.edu.vn/Qdchinhsachhocbong  \n   Lưu ý: Điều kiện duy trì học bổng cho học kỳ tiếp theo.\n\n2. Danh sách sinh viên dự kiến được xét cấp học bổng:  \n   - Đây là kết quả dự kiến nên kết quả chính thức có thể sẽ có sự thay đổi, cập nhật sau thời hạn sinh viên thắc mắc.  \n   - Những sinh viên nào có tên trong danh sách thì cung cấp thông tin tài khoản do chính sinh viên làm chủ tài khoản thì mới chuyển được học bổng tại: https://link.hcmus.edu.vn/TK-hocbong2024  \n\n3. Thắc mắc:  \n   Nếu có thắc mắc thì sinh viên liên hệ qua địa chỉ email: accounting@apcs.fitus.edu.vn  \n   Tiêu đề: \"[HB] Thắc mắc học bổng TSV K2024\" để được xem xét.  \n\n4. Hình thức nhận học bổng: chuyển khoản  \n\n5. Thời hạn thắc mắc:  \n   Từ ngày ra thông báo đến hết ngày 06/11/2024.  \n   Sau thời hạn trên, Khoa sẽ không giải quyết bất kỳ trường hợp nào.\n\nTitle: Thông tin học bổng MEXT 2023\nArticle: https://www.jaist.ac.jp/english/admissions/application-guide/guide-m-scholarship.html\n\n----\n\nBP. Giáo Vụ SĐH, Khoa CNTT\n\nEmail: giaovusdh@fit.hcmus.edu.vn\n\nWebsite: www.fit.hcmus.edu.vn/vn/sdh\n\nFacebook: https://www.facebook.com/sdh.fit.hcmus/\n\nTitle: Thông tin trợ cấp xã hội\nArticle: 141 \n  \nMỘT VÀI MÁCH NH Ỏ TÂN SINH VIÊN  \n \nCHU ẨN BỊ BẢN SAO (CÓ CH ỨNG TH ỰC) C ỦA CÁC GI ẤY TỜ CẦN THI ẾT \nNgoài chứng minh nhân dân (th ẻ căn cước công dân) nh ất thiết phải có \nbản chính và m ột vài bản sao có sao y ch ứng thực, sinh viên c ần chu ẩn bị \nthêm m ột số loại giấy tờ cần thi ết (số lượng bản, bản chính ho ặc bản sao \ncó công ch ứng tuỳ loại giấy tờ): giấy chứng nhận thuộc diện chính sách (con \nthương binh, con b ệnh binh, gia đình có công v ới cách mạng), sổ hộ nghèo, \nhộ cận nghèo, ch ứng nhận thường trú ở vùng sâu vùng cao, b ản sao học bạ \nTHPT, bản sao chứng thực giấy báo nhập học,… Các lo ại giấy tờ này sẽ cần \nthiết khi làm th ủ tục KTX, xin h ọc bổng, các th ủ tục liên quan ch ế độ chính \nsách, tìm vi ệc làm thêm,… Tuy nhiên, c ần lưu ý đến thời gian có hi ệu lực của \ncác loại giấy tờ này. Việc sao y bản chính các lo ại giấy tờ này có th ể thực hiện \nở bất kỳ UBND phư ờng xã nào g ần nhất với bạn. \n \nHỌC CÁCH S Ử DỤNG MÁY TÍNH VÀ INTERNET  \nLên kế hoạch học cách sử dụng thành th ạo máy vi tính và Internet . \nBạn cần biết những kỹ năng cơ b ản của vi tính văn phòng như các chương \ntrình Word, Excel, Powerpoint, c ần biết làm thế nào để tìm thông tin, hình \nảnh và gửi - nhận thông tin b ằng email trên m ạng Internet, cách s ử dụng các \nmạng xã hội thông d ụng như Facebook, Zalo,… h ỗ trợ cho việc học tập, kết \nnối. Chúng ta s ẽ sử dụng những kỹ năng này đ ể tham gia vào quá trình h ọc \ntập chủ động ở bậc Đại học, Cao đẳng mà các gi ảng viên đã và đang yêu c ầu \nsinh viên.  \n \nXEM THÔNG TIN TRÊN WEBSITE TRƯ ỜNG THƯ ỜNG XUYÊN  \nCác thông tin chính th ức của Nhà trư ờng như h ọc bổng, học phí, thời \nkhóa biểu,… đều sẽ được đăng t ải chính th ức trên website c ủa Trư ờng \n(https://hcmus.edu.vn/). Các b ạn cần theo dõi thư ờng xuyên, chú ý các m ốc \n\nTitle: Danh sách dự kiến cấp xét học bổng đột xuất HK1 năm học 2023-2024\nArticle: 1. Căn cứ xét học bổng: Căn cứ Quyết định số 622/QĐ-KHTN về việc ban hành Quy định về chính sách học bổng dành cho sinh viên: t.ly/3OtGM2.\n\nDanh sách sinh viên dự kiến được xét cấp học bổng.\n\nĐây là kết quả dự kiến nên kết quả chính thức có thể sẽ có sự thay đổi, cập nhật sau thời hạn sinh viên thắc mắc.\n\n2. Thắc mắc: Nếu có thắc mắc, sinh viên liên hệ qua địa chỉ email: accounting@apcs.fitus.edu.vn tiêu đề: “[HB] Thắc mắc học bổng đột xuất HK1/2023-2024” để được xem xét.\n\n3. Hình thức nhận học bổng: chuyển khoản\n\n4. Thời hạn thắc mắc: Từ ngày ra thông báo đến hết ngày 03/06/2024. Sau thời hạn trên, Khoa sẽ không giải quyết bất kỳ trường hợp nào.\n\n"
      }
    },
    {
      "question": "Cách thức đóng học phí 2024 chương trình Chất Lượng Cao.",
      "resource": {
        "chosen_collections": "academic_affairs",
        "filter_expressions": {
          "academic_affairs": "school_year == 2024",
          "student_handbook": "school_year == 2024"
        },
        "context": "Title: Thông báo mở lớp bổ túc kiến thức dự thi thạc sĩ khoá tháng 4/2024\nArticle: Hình thức đóng học phí:\n\na) Chuyển khoản:\n- Qua dịch vụ Internet Banking của Agribank: theo hình thức Bill Payment. \n- Viettel Money.\n- Trực tiếp tại ngân hàng Agribank: Học viên đóng học phí tại các chi nhánh, phòng giao dịch của ngân hàng Agribank.\n+ Khi đóng học phí, học viên cung cấp “Số CCCD” và tên trường ĐH Khoa học Tự nhiên cho nhân viên ngân hàng. \n+ Sau khi đóng tiền, học viên phải giữ chứng từ nộp tiền của ngân hàng để xác nhận đã đóng học phí. Hóa đơn thu học phí sẽ được phòng Kế hoạch Tài chính, trường ĐH KHTN gửi về địa chỉ email của học viên đã cung cấp. \n- Qua cổng kết nối thanh toán của VNPAY: Học viên có nhu cầu thanh toán học phí chỉ cần đăng nhập vào website: https://hocphi.hcmus.edu.vn, số CCCD để đăng nhập và thanh toán. VNPAY kết nối với 40 ngân hàng tại Việt Nam, khi thanh toán xong sẽ gạch nợ trực tiếp trên hệ thống thu học phí của nhà trường. \n- Phí giao dịch (do người sử dụng kênh thanh toán trả): Thẻ nội địa/tài khoản ngân hàng/ví điện tử: 5.500 VNĐ/giao dịch\n\nb) Tiền mặt:\n- Học viên đóng tiền mặt trực tiếp tại phòng Kế hoạch tài chính Trường Đại học Khoa học Tự nhiên (phòng B01).\n\nTitle: Thông báo đăng ký chuyển sang hệ tự túc áp dụng cho học viên cao học khoá 31/2021\nArticle: 4. Học phí chuyển sang hệ tự túc:\n\n4.1. Thời gian đóng học phí: \nTừ ngày ra thông báo đến 16h ngày 26/02/2024.\n\n4.2. Mức thu:\n   a) Học viên không đổi cán bộ hướng dẫn: 2.400.000 đồng.\n   b) Học viên đổi cán bộ hướng dẫn: 5.400.000 đồng.\n   c) Học viên đã bảo vệ luận văn thạc sĩ trước ngày 31/12/2023:\n      - Học viên hoàn thành tín chỉ môn học và còn nợ chứng chỉ ngoại ngữ: Không phải nộp học phí chuyển hệ tự túc.\n      - Học viên còn nợ tín chỉ môn học sẽ nộp học phí theo số tín chỉ môn học và theo quy định mức thu hiện hành của Nhà trường.\n\n4.3. Hình thức đóng học phí: HV nhận thông báo mức thu học phí chuyển tự túc tại Phòng ĐT Sau đại học (phòng B08) và đóng học phí trực tiếp tại Phòng Kế hoạch tài chính.\n\nWebsite: https://sdh.hcmus.edu.vn/2024/01/22/thong-bao-dang-ky-chuyen-sang-he-tu-tuc-ap-dung-cho-hoc-vien-cao-hoc-khoa-31-2021/\n\n-----BP. Giáo Vụ SĐH, Khoa CNTT\nEmail: giaovusdh@fit.hcmus.edu.vn\nWebsite: https://www.fit.hcmus.edu.vn/sau-dai-hoc\nFacebook: https://www.facebook.com/sdh.fit.hcmus/\n\nTitle: Thông báo nhập học trình độ thạc sĩ khóa 34/2024 – đợt 1\nArticle: b) Ứng dụng Viettel Money\n   - HV đóng học phí trên App “Viettel Money” còn gọi là hệ sinh thái tài chính số. App Viettel Money cài đặt được tất cả các nhà mạng viễn thông, liên kết với hầu hết các ngân hàng trên toàn quốc, chi tiết hướng dẫn thanh toán tại: https://viettelmoney.vn/.\n   - Khi cần thiết vui lòng liên hệ số điện thoại 0979.587.739 (anh Minh) hoặc số tổng đài 18009000 (miễn phí) để được hỗ trợ từ Viettel Money hướng dẫn đóng học phí.\n\nc) Cổng kết nối thanh toán của VNPAY:\n   - HV đăng nhập vào website: https://hocphi.hcmus.edu.vn, gõ mã HV để đăng nhập và thanh toán.\n   - VNPAY kết nối với 40 ngân hàng tại Việt Nam, khi thanh toán xong sẽ tự cập nhật học phí đã đóng của HV trực tiếp trên hệ thống thu học phí của nhà trường.\n   - Phí giao dịch (do người sử dụng kênh thanh toán trả) như sau:\n     - Thẻ nội địa/tài khoản ngân hàng/ví điện tử: 5.500 VNĐ/giao dịch\n     - Thẻ quốc tế BIN trong nước: 1,6%/giao dịch\n\nTitle: Khoa công nghệ thông tin\nArticle: CHƯƠNG TRÌNH ĐÀO TẠO CHẤT LƯỢNG CAO \nNGÀNH CÔNG NGHỆ THÔNG TINCÁC CHƯƠNG TRÌNH ĐÀO TẠO THEO ĐỀ ÁN – KHOA CÔNG NGHỆ THÔNG TIN\n Với mục tiêu nâng cao chất lượng đào tạo trình độ đại học nhằm đáp ứng \nnguồn nhân lực có tính cạnh tranh cao trên thị trường lao động trong thời kỳ hội nhập kinh tế khu vực và thế giới, Khoa Công nghệ thông tin triển khai tuyển sinh chương trình đào tạo Chất lượng cao ngành Công nghệ Thông tin đầu tiên vào năm 2013.\n Chương trình đào tạo được xây dựng phát triển trên cơ sở chương trình đào tạo chính quy chuẩn, có tham khảo các khung chương trình đào tạo của các tổ chức nghề nghiệp lớn trên thế giới với yêu cầu về nâng cao trình độ kiến thức nghề nghiệp, nội dung giảng dạy sâu rộng hơn, đề cao tư duy sáng tạo, tự học, tăng cường kỹ năng thực hành, kiến thức thực tế, phát triển kỹ năng cá nhân và khả năng sử dụng ngoại ngữ. \n22\n\n"
      }
    }
  ])
}

// Assuming recommended_questions is defined elsewhere
if (!collectionAlreadyInDB.includes('users')) {
  db.createCollection('users')
  db.users.insertMany([
    {
      "_id": {
        "$oid": "681c5d1b473503110ab2fa71"
      },
      "name": "Mạch Vĩ Kiệt",
      "email": "admin",
      "password": "$2b$05$AonjaS0Hlevc2DCgkS/pKOGWJbkZc97Dx3PicgJlM/PJmAtgPvu9y",
      "educationRole": "adminstrator",
      "academicInformation": {
        "administrativeUnit": "administrativeUnit_Khoa-cong-nghe-thong-tin",
        "lecturerPosition": "lecturerPosition_Giang-vien",
        "teachingDepartment": "teachingDepartment"
      },
      "verification": "490000",
      "verified": true,
      "loginAttempts": 0,
      "blockExpires": {
        "$date": "2025-05-08T07:28:27.297Z"
      },
      "createdAt": {
        "$date": "2025-05-08T07:28:27.301Z"
      },
      "updatedAt": {
        "$date": "2025-05-08T07:28:27.301Z"
      }
    }
  ])
}