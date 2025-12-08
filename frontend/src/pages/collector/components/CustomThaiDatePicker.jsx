// CustomThaiDatePickerCollector.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem, IconButton, Popover } from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";
import dayjs from "dayjs";

const CustomThaiDatePickerCollector = ({ date, setDate, mode = "day" }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

  // เปิด popup
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // สร้าง options วัน / เดือน / ปี
  const daysInMonth = selectedDate.daysInMonth();
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // ปีพ.ศ. จาก 80 ปีที่ผ่านมา ถึง 10 ปีข้างหน้า
  const currentBuddhistYear = dayjs().year() + 543;
  const yearOptions = Array.from({ length: 90 + 10 }, (_, i) => currentBuddhistYear - 80 + i);

  // เมื่อเลือกวัน / เดือน / ปี
  const handleSelect = (d, m, y) => {
    const adYear = y - 543;
    const newDate = dayjs(`${adYear}-${m}-${d}`);
    if (newDate.isValid()) {
      setSelectedDate(newDate);
      setDate(newDate.format("YYYY-MM-DD"));
    }
  };

    // ปรับวันตามเดือนและปี
  useEffect(() => {
    if (selectedDate.date() > selectedDate.daysInMonth()) {
      const newDate = selectedDate.date(selectedDate.daysInMonth());
      setSelectedDate(newDate);
      setDate(newDate.format("YYYY-MM-DD"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <>
      <Box display="flex" alignItems="center">
        <TextField
          size="small"
          fullWidth
          label={
            mode === "day"
              ? "เลือกวันที่"
              : mode === "month"
              ? "เลือกเดือน"
              : "เลือกปี"
          }
          value={
            mode === "day"
              ? selectedDate.format("DD/MM/") + (selectedDate.year() + 543)
              : mode === "month"
              ? selectedDate.format("MM/") + (selectedDate.year() + 543)
              : selectedDate.year() + 543
          }
          onClick={handleClick}
          InputLabelProps={{ shrink: true }}
        />
        <IconButton onClick={handleClick}>
          <CalendarIcon />
        </IconButton>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, display: "flex", gap: 1 }}>
          {mode === "day" && (
            <>
              <TextField
                select
                label="วัน"
                size="small"
                value={selectedDate.date()}
                onChange={(e) =>
                  handleSelect(Number(e.target.value), selectedDate.month() + 1, selectedDate.year() + 543)
                }
              >
                {dayOptions.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="เดือน"
                size="small"
                value={selectedDate.month() + 1}
                onChange={(e) =>
                  handleSelect(selectedDate.date(), Number(e.target.value), selectedDate.year() + 543)
                }
              >
                {monthOptions.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="ปี พ.ศ."
                size="small"
                value={selectedDate.year() + 543}
                onChange={(e) =>
                  handleSelect(selectedDate.date(), selectedDate.month() + 1, Number(e.target.value))
                }
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </TextField>
            </>
          )}

          {mode === "month" && (
            <>
              <TextField
                select
                label="เดือน"
                size="small"
                value={selectedDate.month() + 1}
                onChange={(e) =>
                  handleSelect(1, Number(e.target.value), selectedDate.year() + 543)
                }
              >
                {monthOptions.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="ปี พ.ศ."
                size="small"
                value={selectedDate.year() + 543}
                onChange={(e) =>
                  handleSelect(1, selectedDate.month() + 1, Number(e.target.value))
                }
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </TextField>
            </>
          )}

          {mode === "year" && (
            <TextField
              select
              label="ปี พ.ศ."
              size="small"
              value={selectedDate.year() + 543}
              onChange={(e) =>
                handleSelect(1, 1, Number(e.target.value))
              }
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </TextField>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default CustomThaiDatePickerCollector;
