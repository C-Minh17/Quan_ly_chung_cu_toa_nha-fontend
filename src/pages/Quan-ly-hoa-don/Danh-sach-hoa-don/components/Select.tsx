import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { useEffect } from 'react';
import { useModel, history } from '@umijs/max';

const SelectInvoice = (props: {
  value?: string | null;
  onChange?: (val: string | null) => void;
  multiple?: boolean;
  hasCreate?: boolean;
  placeholder?: string;
  valueType?: 'id' | 'code';
}) => {
  const { value, onChange, multiple, hasCreate, placeholder, valueType = 'code' } = props;
  const { infoAllInvoice, handleGetInfoAllInvoice } = useModel('invoice.invoice');

  useEffect(() => {
    handleGetInfoAllInvoice();
  }, []);

  const onAddNew = () => {
    history.push('/quan-ly-hoa-don/tao-hoa-don');
  };

  return (
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      <div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          value={value}
          onChange={onChange}
          options={infoAllInvoice?.map((item: MInvoice.IRecord) => ({
            key: item._id,
            value: valueType === 'id' ? item._id : item.invoice_code,
            label: `${item.invoice_code} (${item.apartment?.apartment_code || 'N/A'} - Kỳ ${item.billing_month}/${item.billing_year})`,
          }))}
          showSearch
          optionFilterProp='label'
          placeholder={placeholder || 'Chọn mã hóa đơn'}
          style={{ width: '100%' }}
          allowClear
        />
      </div>

      {hasCreate !== false ? (
        <Button icon={<PlusOutlined />} onClick={onAddNew} />
      ) : null}
    </div>
  );
};

export default SelectInvoice;
