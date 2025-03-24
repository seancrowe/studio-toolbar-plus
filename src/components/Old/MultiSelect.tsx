
import React, { useState } from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const SelectTitle = styled.div`
  font-size: 14px;
  color: #fff;
  margin-bottom: 8px;
`;

const SelectWrapper = styled.div`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const SelectedCount = styled.div`
  background-color: #666;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 8px;
`;

const Dropdown = styled.div`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  position: absolute;
  width: 30%;
  max-height: 150px;
  overflow-y: auto;
  color: #fff;
  padding: 8px;
  margin-top: 55px;
`;

const Option = styled.div<{ $isSelected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.$isSelected ? "red" : "#333")};
  &:hover {
    background-color: #444;
  }
`;

type MultiSelectProps = {
  title: string,
  options: string[]
}

const MultiSelect: React.FC<MultiSelectProps> = ({ title, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleDropdown = () => {
    console.log("hi", options)
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  if (isOpen) {
    return (
      <SelectContainer>
        <SelectTitle>{title}</SelectTitle>
        <SelectWrapper onClick={toggleDropdown}>
          {title}
          <SelectedCount>{selected.length}</SelectedCount>
        </SelectWrapper>
        <Dropdown>
          {options.map((option, index) => (
            <Option key={index} $isSelected={selected.includes(option)} onClick={() => handleSelect(option)}>
              {option}
            </Option>
          ))}
        </Dropdown>
      </SelectContainer>
    )

  }

  return (
    <SelectContainer>
      <SelectTitle>{title}</SelectTitle>
      <SelectWrapper onClick={toggleDropdown}>
        {title}
        <SelectedCount>{selected.length}</SelectedCount>
      </SelectWrapper>
    </SelectContainer>
  );
};

export default MultiSelect;
