import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { alertService, AlertType } from "services";

export { Alert };

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: "default-alert",
  fade: true,
};

function Alert({ id, fade }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // set 'keepAfterRouteChange' flag to false on the rest
          filteredAlerts.forEach((x) => delete x.keepAfterRouteChange);
          return filteredAlerts;
        });
      } else {
        // add alert to array
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const clearAlerts = () => {
      setTimeout(() => alertService.clear(id));
    };
    router.events.on("routeChangeStart", clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off("routeChangeStart", clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeAlert(alert) {
    if (fade) {
      // fade out alert
      const alertWithFade = { ...alert, fade: true };
      setAlerts((alerts) =>
        alerts.map((x) => (x === alert ? alertWithFade : x))
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert));
    }
  }

  function cssClasses(alert) {
    if (!alert) return;

    const classes = ["alert", "alert-dismissable"];

    const alertTypeClass = {
      [AlertType.Success]:
        "p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800",
      [AlertType.Error]:
        "p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800",
      [AlertType.Info]:
        "p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800",
      [AlertType.Warning]:
        "p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800",
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push("fade");
    }

    return classes.join(" ");
  }

  if (!alerts.length) return null;

  return (
    <div className="container">
      <div className="mt-3">
        {alerts.map((alert, index) => (
          <div key={index} className={cssClasses(alert)} role="alert">
            <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>{" "}
            <a className="close ml-1" onClick={() => removeAlert(alert)}>
              &times;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
