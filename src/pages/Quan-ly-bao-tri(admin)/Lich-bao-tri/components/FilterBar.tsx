import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (filters: {
    statusFilter: string;
    frequencyFilter: string;
  }) => void;
  currentStatusFilter: string;
  currentFrequencyFilter: string;
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  currentStatusFilter,
  currentFrequencyFilter,
}: Props) => {
  const [draftStatus, setDraftStatus] = useState(currentStatusFilter);
  const [draftFrequency, setDraftFrequency] = useState(currentFrequencyFilter);

  useEffect(() => {
    if (visible) {
      setDraftStatus(currentStatusFilter);
      setDraftFrequency(currentFrequencyFilter);
    }
  }, [visible, currentStatusFilter, currentFrequencyFilter]);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
          <FilterOutlined style={{ color: '#1677ff' }} />
          <span>Bộ lọc tùy chỉnh</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        onApply({
          statusFilter: draftStatus,
          frequencyFilter: draftFrequency,
        });
      }}
      okText="Áp dụng tùy chỉnh"
      cancelText="Hủy"
      destroyOnClose
      okButtonProps={{
        style: { borderRadius: 6 }
      }}
      cancelButtonProps={{
        style: { borderRadius: 6 }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0 8px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Trạng thái:</span>
          <Select
            style={{ width: '100%' }}
            value={draftStatus}
            onChange={setDraftStatus}
          >
            <Option value="all">Tất cả</Option>
            <Option value="scheduled">Đã lên lịch</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Tần suất:</span>
          <Select
            style={{ width: '100%' }}
            value={draftFrequency}
            onChange={setDraftFrequency}
          >
            <Option value="all">Tất cả</Option>
            <Option value="once">Một lần</Option>
            <Option value="weekly">Hàng tuần</Option>
            <Option value="monthly">Hàng tháng</Option>
            <Option value="quarterly">Hàng quý</Option>
            <Option value="yearly">Hàng năm</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
