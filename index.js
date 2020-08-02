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
          RESET_VALUES: {
            actions: assign({
              fahrenheit: null,
              celsius: null,
            }),
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

const sendEventType = (type, e) => {
  const value = e.target.value;
  if (isNaN(Number(value))) return;
  // we want any form of an empty string to rest the values
  if (value.trim() === "") {
    service.send("RESET_VALUES");
  } else {
    service.send({
      type,
      value,
    });
  }
};

celsiusInput.addEventListener("input", (e) =>
  sendEventType("UPDATE_FAHRENHEIT", e)
);

fahrenheitInput.addEventListener("input", (e) =>
  sendEventType("UPDATE_CELSIUS", e)
);
