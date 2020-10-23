class Response {}

class SuccessResponse extends Response {
  constructor(data) {
    super();
    this.status = "success";
    this.data = data;
  }
}

class FailResponse extends Response {
  constructor(data) {
    super();
    this.status = "fail";
    this.data = data;
  }
}

class ErrorResponse extends Response {
  constructor(message, code, data) {
    super();
    this.status = "error";
    this.message = message;
    this.code = code;
    this.data = data;
  }
}

module.exports = {
  SuccessResponse,
  FailResponse,
  ErrorResponse,
};
