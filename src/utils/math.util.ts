import { subtract, multiply } from 'ramda';

export const multiplication = (multiplicand: number, multiplier: number): number => multiply(multiplicand, multiplier);

export const subtraction = (firstNumber: number, secondNumber: number): number => subtract(firstNumber, secondNumber);
