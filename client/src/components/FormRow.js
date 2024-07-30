import React from 'react'

function FormRow({ type, name, value, handelChange, labelText, disabled=false }) {
    return (
        <div className='form-row'>
            <label htmlFor={name} className='form-label'>{labelText || name}</label>
            <input type={type} value={value} onChange={handelChange} name={name} className='form-input' disabled={disabled}></input>
        </div>
    )
}

export default FormRow
