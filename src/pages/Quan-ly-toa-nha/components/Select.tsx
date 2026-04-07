import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import FormBuilding from './Form';

const SelectBuilding = (props: {
  value?: string | null;
  onChange?: (val: string | null) => void;
  multiple?: boolean;
  hasCreate?: boolean;
}) => {
  const { value, onChange, multiple, hasCreate } = props;
  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel('building.building');

  const [visibleForm, setVisibleForm] = useState(false);
  const [record, setRecord] = useState<MBuilding.IRecord | undefined>(undefined);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!visibleForm) handleGetInfoAllBuilding();
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
          options={infoAllBuilding?.map((item: MBuilding.IRecord) => ({
            key: item._id,
            value: item._id,
            label: item.name || item._id,
          }))}
          showSearch
          optionFilterProp='label'
          placeholder='Chọn tòa nhà'
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
            width={600}
          >
            <FormBuilding
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

export default SelectBuilding;
