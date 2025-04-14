export const getTime = (DateString) => {
    const date = new Date(DateString);

    // Lấy giờ, phút và xác định AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    // Chuyển sang định dạng 12 giờ
    hours = hours % 12 || 12; // Nếu giờ là 0, chuyển thành 12
    // Định dạng chuỗi kết quả
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
}

export const formatTime = (isoString) => {
    if(!isoString) isoString = "2024-09-22T02:54:51.052Z"
    try {
        const date = new Date(isoString);
        const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        };
    
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const [time, datePart] = formatter.format(date).split(','); // Tách thời gian và ngày
    
        return `${time} - ${datePart}`
    } catch (err) {
        // console.error('Tranform Date Format Errors')
        return "###"
    }
}


export const formatTime_Time_Date_Month_Year = (timestamp) => {

    // Chuyển đổi timestamp thành đối tượng Date
    let date = new Date(timestamp * 1000); // timestamp phải nhân với 1000 vì JavaScript sử dụng millisecond

    // Lấy ngày, tháng, năm từ đối tượng Date
    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0-11), nên cần cộng thêm 1
    let year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formatNumber = (num) => (num < 10 ? '0' + num : num);

    return `${hours}:${formatNumber(minutes)} - ${day}/${month}/${year}`
}

export const formatTime_Date_Month = (timestamp) => {

    // Chuyển đổi timestamp thành đối tượng Date
    let date = new Date(timestamp * 1000); // timestamp phải nhân với 1000 vì JavaScript sử dụng millisecond

    // Lấy ngày, tháng, năm từ đối tượng Date
    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0-11), nên cần cộng thêm 1
    let year = date.getFullYear();

    return `${day}/${month}`
}