import ExtendableError from "extendable-error";

class LumenError extends ExtendableError {
  constructor(message: string, public code: number) {
    super(message);
  }
}

export default LumenError;
