export type ModalProps = {
  title: string;
  show: boolean;
  content: JSX.Element;
  onClose: () => void;
};
