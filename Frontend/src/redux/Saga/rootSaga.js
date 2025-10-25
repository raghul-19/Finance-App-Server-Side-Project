import { all } from "redux-saga/effects";
import { watchAsyncFunctions } from "./SagaFunction";

function * rootSaga() {
    console.log("Saga Running");
    yield all([watchAsyncFunctions()]);
}

export default rootSaga;