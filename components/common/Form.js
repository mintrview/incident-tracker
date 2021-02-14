import styled from "styled-components";

export const FormContainer = styled.form`
  width: ${(props) => props.width || "30%"};
  box-sizing: border-box;
  margin-right: 20px;
  padding: ${(props) => props.padding || "0"};

  h2 {
    margin-top: 0;
    border-bottom: 1px solid #f0f0f0;
  }

  a {
    font-size: 12px;
    text-align: center;
    display: block;
    text-decoration: underline;
    margin-top: 10px;
    color: #0198ff;
    cursor: pointer;
  }

  label {
    display: block;
    margin-bottom: 10px;
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }
  }

  input {
    display: block;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #e1e1e1;
    padding: 10px;
    font-size: 12px;
    font-family: inherit;
  }

  textarea {
    display: block;
    min-width: 100%;
    max-width: 100%;
    width: 349px;
    height: 125px;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #e1e1e1;
    padding: 10px;
    font-size: 12px;
    font-family: inherit;
  }
`;
