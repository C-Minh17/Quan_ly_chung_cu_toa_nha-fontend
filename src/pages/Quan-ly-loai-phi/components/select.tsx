import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import FormFeeType from './form';

const SelectFeeType = (props: {
  value?: string | null;
  onChange?: (val: string | null) => void;
  multiple?: boolean;
  hasCreate?: boolean;
  placeholder?: string;
}) => {
  const { value, onChange, multiple, hasCreate, placeholder } = props;
  const { infoAllFeeType, handleGetInfoAllFeeType } = useModel('feeType.feeType');

  const [visibleForm, setVisibleForm] = useState(false);

  useEffect(() => {
    if (!visibleForm) handleGetInfoAllFeeType();
  }, [visibleForm]);

  const onAddNew = () => {
    setVisibleForm(true);
  };

  return (
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      <div style={{ flex: 1 }}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          value={value}
          onChange={onChange}
          options={infoAllFeeType?.map((item: MFeeType.IRecord) => ({
            key: item._id,
            value: item._id,
            label: `${item.name} (${item.unit_price?.toLocaleString('vi-VN')} VNĐ/${item.unit})`,
          }))}
          showSearch
          optionFilterProp='label'
          placeholder={placeholder || 'Chọn loại phí'}
          style={{ width: '100%' }}
        />
      </div>

      {hasCreate !== false ? (
        <>
          <Button icon={<PlusOutlined />} onClick={onAddNew} />
          <Modal
            title="Thêm mới loại phí"
            open={visibleForm}
            footer={null}
            onCancel={() => setVisibleForm(false)}
            destroyOnClose
            width={800}
          >
            <FormFeeType
              setShowEdit={setVisibleForm}
              edit={false}
            />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default SelectFeeType;
