import styled from "styled-components";

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  background: #0198ff;
  border: 0;
  border-radius: 2px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 10px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #006ab3;
  }

  &:disabled {
    background: #6496b9;
  }
`;
