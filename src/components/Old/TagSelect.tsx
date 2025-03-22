import React, { useState } from 'react';
import styled from 'styled-components';

const TagInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
`;

const Tag = styled.div`
  background-color: #444;
  color: white;
  border-radius: 20px;
  padding: 6px 12px;
  margin: 4px;
  display: flex;
  align-items: center;

  & span {
    margin-left: 8px;
    cursor: pointer;
  }
`;

const Dropdown = styled.div`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  color: #fff;
  padding: 8px;
  z-index: 10;
`;

const Option = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const TagSelect = ({ options }) => {
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelected([...selected, option]);
    setIsOpen(false); // Close the dropdown after selecting
  };

  const handleRemove = (item) => {
    setSelected(selected.filter((selectedItem) => selectedItem !== item));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TagInputContainer>
        {selected.map((item, index) => (
          <Tag key={index}>
            {item}
            <span onClick={() => handleRemove(item)}>x</span>
          </Tag>
        ))}
        <input
          type="text"
          placeholder="Select items..."
          onClick={toggleDropdown}
          onChange={handleSearchChange}
          style={{ backgroundColor: '#333', border: 'none', color: 'white', flex: 1 }}
        />
      </TagInputContainer>
      {isOpen && (
        <Dropdown>
          {filteredOptions.map((option, index) => (
            <Option key={index} onClick={() => handleSelect(option)}>
              {option}
            </Option>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default TagSelect;

