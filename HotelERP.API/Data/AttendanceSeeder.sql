-- Insert mock attendance data for testing
-- This script inserts sample attendance records for 10+ employees with multiple dates

-- Insert attendance records for today and past dates
INSERT INTO EmployeeAttendances (EmployeeId, AttendanceDate, CheckInTime, CheckOutTime, Status, WorkingHours, OvertimeHours, Notes, IsActive, CreatedAt, UpdatedAt)
VALUES
-- TODAY - Employee 1 (Ali Hassan - EMP001) - Present
(1, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 9, 0, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 18, 0, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 2 (Aisha Malik - EMP002) - Present
(2, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 8, 30, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 17, 30, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 3 - Present with Overtime
(3, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 8, 0, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 19, 0, 0, 0), 'Present', 11, 3, 'Extra hours worked', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 4 - Absent
(4, CAST(GETDATE() AS DATE), NULL, NULL, 'Absent', 0, 0, 'No check-in', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 5 - Late
(5, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 10, 15, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 18, 30, 0, 0), 'Late', 8.25, 0, 'Arrived late', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 6 - Half Day
(6, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 9, 0, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 13, 0, 0, 0), 'Half Day', 4, 0, 'Half day leave', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 7 - Present
(7, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 9, 30, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 18, 30, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 8 - Present
(8, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 8, 45, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 17, 45, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 9 - Present with Overtime
(9, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 8, 0, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 20, 0, 0, 0), 'Present', 12, 4, 'Extra hours worked', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 10 - Absent
(10, CAST(GETDATE() AS DATE), NULL, NULL, 'Absent', 0, 0, 'No check-in', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 11 - Present
(11, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 9, 0, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 18, 0, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TODAY - Employee 12 - Late
(12, CAST(GETDATE() AS DATE), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 9, 45, 0, 0), DATETIMEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE()), 18, 45, 0, 0), 'Late', 9, 0, 'Arrived late', 1, GETDATE(), GETDATE()),

-- YESTERDAY - Employee 1 - Absent
(1, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), NULL, NULL, 'Absent', 0, 0, 'No check-in', 1, GETDATE(), GETDATE()),

-- YESTERDAY - Employee 2 - Present with Overtime
(2, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 7, 0, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 19, 0, 0, 0), 'Present', 12, 4, 'Extra hours worked', 1, GETDATE(), GETDATE()),

-- YESTERDAY - Employee 3 - Present
(3, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 9, 0, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 18, 0, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- YESTERDAY - Employee 4 - Half Day
(4, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 9, 0, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 13, 0, 0, 0), 'Half Day', 4, 0, 'Half day leave', 1, GETDATE(), GETDATE()),

-- YESTERDAY - Employee 5 - Present
(5, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 8, 30, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -1, GETDATE())), MONTH(DATEADD(DAY, -1, GETDATE())), DAY(DATEADD(DAY, -1, GETDATE())), 17, 30, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TWO DAYS AGO - Employee 1 - Late
(1, CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 10, 0, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 18, 0, 0, 0), 'Late', 8, 0, 'Arrived late', 1, GETDATE(), GETDATE()),

-- TWO DAYS AGO - Employee 2 - Half Day
(2, CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 8, 30, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 13, 0, 0, 0), 'Half Day', 4.5, 0, 'Half day leave', 1, GETDATE(), GETDATE()),

-- TWO DAYS AGO - Employee 3 - Present
(3, CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 9, 0, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 18, 0, 0, 0), 'Present', 9, 0, 'Regular working hours', 1, GETDATE(), GETDATE()),

-- TWO DAYS AGO - Employee 4 - Absent
(4, CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), NULL, NULL, 'Absent', 0, 0, 'No check-in', 1, GETDATE(), GETDATE()),

-- TWO DAYS AGO - Employee 5 - Present with Overtime
(5, CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 8, 0, 0, 0), DATETIMEFROMPARTS(YEAR(DATEADD(DAY, -2, GETDATE())), MONTH(DATEADD(DAY, -2, GETDATE())), DAY(DATEADD(DAY, -2, GETDATE())), 19, 30, 0, 0), 'Present', 11.5, 3.5, 'Extra hours worked', 1, GETDATE(), GETDATE());

-- Verify the inserted data
SELECT 
    a.Id,
    a.EmployeeId,
    e.FirstName + ' ' + e.LastName AS EmployeeName,
    e.EmployeeCode,
    a.AttendanceDate,
    a.CheckInTime,
    a.CheckOutTime,
    a.Status,
    a.WorkingHours,
    a.OvertimeHours,
    a.Notes
FROM EmployeeAttendances a
INNER JOIN Employees e ON a.EmployeeId = e.Id
WHERE a.IsActive = 1
ORDER BY a.AttendanceDate DESC, e.FirstNamec:\Users\hp\AppData\Local\Packages\MicrosoftWindows.Client.Core_cw5n1h2txyewy\TempState\ScreenClip\{4FD84389-73A5-44CA-9D75-D1E53ED6981E}.png;
