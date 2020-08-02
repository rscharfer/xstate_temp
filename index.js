import { createMachine, interpret, assign } from "xstate";

const fahrenheitToCelsius = (temp) => ((temp - 32) * 5) / 9;
const celsiusToFahrenheit = (temp) => temp * (9 / 5) + 32;

const celsiusInput = document.querySelector("#celsius");
const fahrenheitInput = document.querySelector("#fahrenheit");

const updateDom = (state) => {
  const { fahrenheit, celsius } = state.context;
  celsiusInput.value = celsius;
  fahrenheitInput.value = fahrenheit;
};

const machine = createMachine(
  {
    initial: "active",
    context: {
      fahrenheit: null,
      celsius: null,
    },
    states: {
      active: {
        on: {
          UPDATE_FAHRENHEIT: {
            actions: [
              assign({
                fahrenheit: (_, e) => celsiusToFahrenheit(e.value),
                celsius: (_, e) => e.value,
              }),
              "logNewValues",
            ],
          },
          UPDATE_CELSIUS: {
            actions: [
              assign({
                fahrenheit: (_, e) => e.value,
                celsius: (_, e) => fahrenheitToCelsius(e.value),
              }),
              "logNewValues",
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      logNewValues: (c, e) => {
        console.log("new values", c, e);
      },
    },
  }
);

const service = interpret(machine).start().onTransition(updateDom);

celsiusInput.addEventListener("input", (e) =>
  service.send({
    type: "UPDATE_FAHRENHEIT",
    value: e.target.value,
  })
);

fahrenheitInput.addEventListener("input", (e) =>
  service.send({
    type: "UPDATE_CELSIUS",
    value: e.target.value,
  })
);
