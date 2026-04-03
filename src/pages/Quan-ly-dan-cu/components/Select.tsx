import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import FormResident from './Form';

const SelectResident = (props: {
  value?: string | null;
  onChange?: (val: string | null) => void;
  multiple?: boolean;
  hasCreate?: boolean;
}) => {
  const { value, onChange, multiple, hasCreate } = props;
  const { infoAllResident, handleGetInfoAllResident } = useModel('resident.resident');

  const [visibleForm, setVisibleForm] = useState(false);
  const [record, setRecord] = useState<MResident.IRecord | undefined>(undefined);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!visibleForm) handleGetInfoAllResident();
  }, [visibleForm]);  

  const onAddNew = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  return (
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      <div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          value={value}
          onChange={onChange}
          options={infoAllResident?.map((item: MResident.IRecord) => ({
            key: item._id,
            value: item._id,
            label: `${item.user?.name || 'Chưa rõ'} (${item.id_card_number || 'N/A'})`,
          }))}
          showSearch
          optionFilterProp='label'
          placeholder='Chọn dân cư'
          style={{ width: '100%' }}
        />
      </div>

      {hasCreate !== false ? (
        <>
          <Button icon={<PlusOutlined />} onClick={onAddNew} />
          <Modal
            open={visibleForm}
            styles={{ body: { padding: 0 } }}
            footer={null}
            onCancel={() => setVisibleForm(false)}
            destroyOnClose
            width={800}
          >
            <FormResident
              initialValues={record}
              setShowEdit={setVisibleForm}
              edit={edit}
            />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default SelectResident;
