// EditWasteModal.jsx
import React from 'react';

// รายการประเภทขยะหลัก
const WASTE_TYPES = [
    { id: '1', name: '01 ขยะเปื้อน' },
    { id: '2', name: '02 ขยะห้องน้ำ' },
    { id: '3', name: '03 ขยะพลังงาน' },
    { id: '4', name: '04 ขยะอันตราย' },
    { id: '5', name: '05 วัสดุรีไซเคิล' },
    { id: '6', name: '06 ขยะย่อยสลาย' },
    { id: '7', name: '07 ขยะชิ้นใหญ่' },
];

// รายการประเภทย่อย
const SUB_WASTE_TYPES = [
    { id: '1', name: '01 ขวดแก้ว' },
    { id: '2', name: '02 ขวดพลาสติกใส' },
    { id: '3', name: '03 เหล็ก/โลหะ/สังกะสี/กระป๋องอลูมิเนียม' },
    { id: '4', name: '04 กระดาษ' },
];

const EditWasteModal = ({ editData, onClose, onChange, onSave, formatDate, formatTime }) => {
    if (!editData) return null;

    const safeFormatDate = typeof formatDate === 'function'
        ? formatDate
        : (d) => (d ? String(d).split('T')[0] : '-');

    const safeFormatTime = typeof formatTime === 'function'
        ? formatTime
        : (t) => (t ? String(t).substring(11, 16) : '-');

    const handleInputChange = (e) => {
        if (typeof onChange !== 'function') {
            console.error("onChange is missing");
            return;
        }

        const { name, value } = e.target;
        let newValue = value;

        // ป้องกันตัวเลขติดลบหรือไม่ใช่ตัวเลขสำหรับ field น้ำหนัก
        if (name === 'vaw_wasteTotal') {
            if (value !== '' && (parseFloat(value) < 0 || isNaN(parseFloat(value)))) {
                return;
            }
        }

        // ถ้าเปลี่ยนประเภทหลักและไม่ใช่ '5' ให้ล้าง sub type
        if (name === 'vaw_wasteType' && value !== '5') {
            onChange({
                ...editData,
                [name]: newValue,
                vaw_subWasteType: ''
            });
            return;
        }

        onChange({
            ...editData,
            [name]: newValue,
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (typeof onSave === 'function') onSave();
    };

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                id="editWasteModal"
                style={{ zIndex: 1055 }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-success text-white border-0 rounded-top-4">
                            <h5 className="modal-title fw-bold">
                                <i className="bi bi-pencil-square me-2"></i> แก้ไขข้อมูลขยะที่บันทึก
                            </h5>
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body p-4">
                            <form onSubmit={handleSave}>
                                <div className="row mb-3 g-2">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold text-muted mb-1">วันที่บันทึก:</label>
                                        <p className="form-control-plaintext fw-bold text-dark">{safeFormatDate(editData.vaw_date)}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold text-muted mb-1">เวลาบันทึก:</label>
                                        <p className="form-control-plaintext fw-bold text-dark">{safeFormatTime(editData.vaw_time)}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className="mb-3">
                                    <label htmlFor="vaw_wasteType" className="form-label fw-semibold">
                                        <span className="text-danger">*</span> ประเภทขยะหลัก:
                                    </label>
                                    <select
                                        id="vaw_wasteType"
                                        name="vaw_wasteType"
                                        value={editData.vaw_wasteType || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="form-select border-primary"
                                    >
                                        <option value="">-- เลือกประเภทขยะ --</option>
                                        {WASTE_TYPES.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {editData.vaw_wasteType === '5' && (
                                    <div className="mb-3">
                                        <label htmlFor="vaw_subWasteType" className="form-label fw-semibold">
                                            <span className="text-danger">*</span> ประเภทขยะย่อย (รีไซเคิล):
                                        </label>
                                        <select
                                            id="vaw_subWasteType"
                                            name="vaw_subWasteType"
                                            value={editData.vaw_subWasteType || ''}
                                            onChange={handleInputChange}
                                            className="form-select border-secondary"
                                            required
                                        >
                                            <option value="">-- เลือกประเภทขยะย่อย --</option>
                                            {SUB_WASTE_TYPES.map(subType => (
                                                <option key={subType.id} value={subType.id}>{subType.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label htmlFor="vaw_wasteTotal" className="form-label fw-semibold">
                                        <span className="text-danger">*</span> น้ำหนัก (กิโลกรัม):
                                    </label>
                                    <input
                                        id="vaw_wasteTotal"
                                        type="number"
                                        step="0.01"
                                        className="form-control border-info"
                                        name="vaw_wasteTotal"
                                        value={editData.vaw_wasteTotal || ''}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary fw-medium rounded-pill px-4"
                                        onClick={onClose}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success fw-bold rounded-pill px-4"
                                    >
                                        <i className="bi bi-save me-1"></i> บันทึกการแก้ไข
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop fade show"
                onClick={onClose}
                style={{ zIndex: 1040 }}
            ></div>
        </>
    );
};

export default EditWasteModal;
