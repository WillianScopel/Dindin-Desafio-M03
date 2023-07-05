import './styles.css'
import closeIconModal from '../../assets/close-icon-modal.svg'
import ButtonDefault from '../Button-Default/';
import { forwardRef, useState } from 'react';
import api from '../../services/api';
import { correctValue } from '../../utils/utils';

function ModalAddEditTransaction({ setShowModalAddEditTransaction, h1modal, listCategories, setTransacionsList, setShowModalEditTransaction, transactionToEdit, setExtract }) {
    const [transactionType, setTransactionType] = useState(transactionToEdit.tipo)

    const [form, setForm] = useState(
        {
            valor: correctValue(transactionToEdit?.valor) === 'R$ NaN' ? '' : correctValue(transactionToEdit?.valor),
            data: !transactionToEdit.data ? '' : transactionToEdit.data.split('T', 1)[0],
            descricao: transactionToEdit?.descricao ?? '',
            tipo: transactionType ?? 'saida',
            categoria_id: transactionToEdit?.categoria_id ?? 0
        },
    );

    function handlechangeType(type) {
        setTransactionType(type)
        setForm({ ...form, tipo: type });
    }


    async function handleAddEditTransaction() {
        if (!form.valor || !form.categoria_id || !form.data || !form.descricao) {
            return
        }

        try {
            const token = localStorage.getItem('token')
            if (h1modal === 'Adicionar Registro') {
                const response = await api.post('/transacao', form, { headers: { 'authorization': `Bearer ${token}` } })
            }

            if (h1modal === 'Editar Registro') {
                const responseUpadate = await api.put(`/transacao/${transactionToEdit.id_transacao}`, form, { headers: { 'authorization': `Bearer ${token}` } });
            }
            const responseTransaction = await api.get(`/transacao`, { headers: { 'authorization': `Bearer ${token}` } })
            const responseExtract = await api.get(`/transacao/extrato`, { headers: { 'authorization': `Bearer ${token}` } })
            setTransacionsList(responseTransaction.data)
            setExtract(responseExtract.data)
            setShowModalAddEditTransaction(false)
        } catch (error) {
            console.log(error.message);
        }
    }


    function handleChangeForm(e) {
        const value = e.target.value;
        setForm({ ...form, [e.target.name]: value });
    }
    return (
        <div className='modal-add-edit-transaction'>
            <div className='modal-add-edit-container'>
                <img
                    src={closeIconModal}
                    className='close-icon'
                    onClick={() => setShowModalAddEditTransaction(false) && setShowModalEditTransaction(false)}
                />
                <h1 className='h1-modal'>{h1modal}</h1>
                <form className='form-edit-add-transaction'>
                    <div className='buttons-container'>
                        <ButtonDefault
                            width={245}
                            height={60}
                            name='tipo'
                            value={form.tipo}
                            content={'Entrada'}
                            colorAddEditModal={form.tipo === 'entrada' ? 'color-blue' : 'color-gray'}
                            defaultFunction={() => handlechangeType('entrada')}
                        />
                        <ButtonDefault
                            width={245}
                            height={60}
                            name='tipo'
                            value={form.tipo}
                            content={'Saída'}
                            colorAddEditModal={form.tipo === 'saida' ? 'color-red' : 'color-gray'}
                            defaultFunction={() => handlechangeType('saida')}
                        />
                    </div>
                    <label
                        htmlFor='valor'
                        className='label-form-add-edit-transaction'
                    >
                        Valor
                    </label>
                    <input
                        className='input-add-edit-transaction'
                        type="text"
                        name="valor"
                        value={form.valor}
                        onChange={(e) => handleChangeForm(e)}
                    />
                    <label
                        htmlFor='categoria'
                        className='label-form-add-edit-transaction'
                    >
                        Categoria
                    </label>
                    <select
                        value={transactionToEdit.categoria_id != 0 && form.categoria_id}
                        name='categoria_id'
                        onChange={(e) => handleChangeForm(e)}
                        className='input-add-edit-transaction'
                    ><option
                        className='option-add-transaction'
                    ></option>
                        {listCategories.data.map((categorie) => (
                            <option key={categorie.id}
                                className='option-add-transaction'
                                value={`${categorie.id}`}>{categorie.descricao}</option>
                        )
                        )}
                    </select>
                    <label
                        htmlFor='data'
                        className='label-form-add-edit-transaction'
                    >
                        Data
                    </label>
                    <input
                        className='input-add-edit-transaction'
                        type="date"
                        name="data"
                        value={form.data}
                        onChange={(e) => handleChangeForm(e)}
                    />
                    <label
                        htmlFor='descricao'
                        className='label-form-add-edit-transaction'
                    >
                        Descrição
                    </label>
                    <input
                        className='input-add-edit-transaction'
                        type="text"
                        name="descricao"
                        value={form.descricao}
                        onChange={(e) => handleChangeForm(e)}
                    />
                    <ButtonDefault
                        width={236}
                        height={46}
                        marginTop={16}
                        content={'Confirmar'}
                        defaultFunction={() => handleAddEditTransaction()}
                    />
                </form>
            </div>
        </div>
    )
}

export default ModalAddEditTransaction