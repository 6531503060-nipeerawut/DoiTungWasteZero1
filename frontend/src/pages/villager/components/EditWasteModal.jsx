import React from 'react';

const EditWasteModal = ({ editData, onClose, onChange, onSave, formatDate, formatTime }) => {
    if (!editData) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({
            ...editData,
            [name]: value,
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <>
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">แก้ไขข้อมูลขยะ</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>ประเภทขยะ</label>
                                    <select
                                        name="vaw_wasteType"
                                        value={editData.vaw_wasteType || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="form-select"
                                    >
                                        <option value="">เลือกประเภทขยะ</option>
                                        <option value="1">01 ขยะเปื้อน</option>
                                        <option value="2">02 ขยะห้องน้ำ</option>
                                        <option value="3">03 ขยะพลังงาน</option>
                                        <option value="4">04 ขยะอันตราย</option>
                                        <option value="5">05 วัสดุรีไซเคิล</option>
                                        <option value="6">06 ขยะย่อยสลาย</option>
                                        <option value="7">07 ขยะชิ้นใหญ่</option>
                                    </select>
                                </div>

                                {editData.vaw_wasteType === '5' && (
                                    <div className="form-group">
                                        <label>ประเภทขยะ(ย่อย)</label>
                                        <select
                                            name="vaw_subWasteType"
                                            value={editData.vaw_subWasteType || ''}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required={editData.vaw_wasteType === '5'}
                                        >
                                            <option value="">เลือกประเภทขยะย่อย</option>
                                            <option value="1">01 ขวดแก้ว</option>
                                            <option value="2">02 ขวดพลาสติกใส</option>
                                            <option value="3">03 เหล็ก/โลหะ/สังกะสี/กระป๋องอลูมิเนียม</option>
                                            <option value="4">04 กระดาษ</option>
                                        </select>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>น้ำหนัก (กก.)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="vaw_wasteTotal"
                                        value={editData.vaw_wasteTotal || ''}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>วันที่</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatDate(editData.vaw_date)}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>เวลา</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatTime(editData.vaw_time)}
                                        readOnly
                                    />
                                </div>

                                <button type="submit" className="btn btn-success mt-3">บันทึก</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional backdrop */}
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default EditWasteModal;