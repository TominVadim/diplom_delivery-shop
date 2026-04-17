"use client";

import { ChangeEvent } from "react";
import { formStyles } from "../styles";
import { InputMask } from "@react-input/mask";

interface PhoneInputProps {
  id: string;
  label: string;
  value?: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput = ({ id, label, value = "+7", onChangeAction }: PhoneInputProps) => {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label}>
        {label}
      </label>
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        id={id}
        type="text"
        value={value}
        placeholder="+7 (___) ___-__-__"
        onChange={onChangeAction}
        className={formStyles.input}
        showMask={true}
        onFocus={(e) => {
          if (e.target.value === "+7") {
            e.target.setSelectionRange(2, 2);
          }
        }}
      />
    </div>
  );
};

export default PhoneInput;
