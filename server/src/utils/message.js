const ErrorMessage = {
  'WRONG_PASSWORD' : 'Tài Khoản hoặc mật khẩu không hợp lệ',
  'USER_DOES_NOT_EXIST': 'Tài Khoản hoặc mật khẩu không hợp lệ',
  'ERR_CONNECTION_REFUSED': 'Server Không Hoạt Động'
}

const Code = {
  'DEPT-GV' : 'Ban Giáo Vụ',
  'school_year': 'Năm Học',
  'keywords': 'Từ Khóa',
  'majors': 'Chuyên Ngành',
  'subjects_code': 'Mã Môn Học',
  'subjects_name': 'Tên Môn Học',
  'PR-CLC': 'Chất Lượng Cao',
  'K21': 'Khóa 2021, Năm 4',
  'K24': 'Khóa 2024, Năm nhất',
  'K23': 'Khóa 2023, Năm 2',
  'K22': 'Khóa 2022, Năm 3',
  'K20': 'Khóa 2020, Năm cuối',
  'KHMT': 'Khoa Học Máy Tính',
  'PR-CNTN': 'Cử Nhân Tài Năng',
  'PR-DT': 'Đại Trà',
  'PR-VP': 'Việt - Pháp',
  'CNPM': 'Công Nghệ Phần Mềm',
  'HTTT': 'Hệ Thống Thông Tin',
  'TGMT': 'Thị Giác Máy Tính',
  'CNTTHUC': 'Công Nghệ Tri Thức',
  'CNTT': 'Công Nghệ Thông Tin',
  'NONE': 'Không có ( Chưa xét chuyên ngành )',
  'student_handbook': 'Sổ tay sinh viên',
  'events': 'Thông tin sự kiện',
  'academic_affairs': 'Nội quy trường học',
  'timetable': 'Thời khóa biểu',
  'female': 'nữ',
  'male': 'nam',
  'ROLE-TP': 'Trưởng Phòng'
}

export const useErrorMessage = (code) => {
  return ErrorMessage[code] ? ErrorMessage[code] : code
}

export const useCode = (code) => {
  return Code[code] ? Code[code] : code
}

const message = {
  useErrorMessage,
  useCode
}

export default message