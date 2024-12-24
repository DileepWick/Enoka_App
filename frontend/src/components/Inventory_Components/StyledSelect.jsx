import React from 'react'
import Select from 'react-select'

const StyledSelect = ({ ...props }) => {
  return (
    <Select
      {...props}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: '#d1d5db',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#9ca3af',
          },
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'black' : 'white',
          color: state.isSelected ? 'white' : 'black',
          '&:hover': {
            backgroundColor: '#f3f4f6',
            color: 'black',
          },
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'black',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: 'black',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          backgroundColor: '#d1d5db',
        }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
          ...theme.colors,
          primary: 'black',
          primary25: '#f3f4f6',
        },
      })}
    />
  )
}

export default StyledSelect

