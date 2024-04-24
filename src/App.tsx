import { Component, createRef } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import Lettering from "@components/Lettering";
import alert from "@assets/alert.wav";
import "./App.scss";
import { AppState, Interval, IntervalType } from "./App.types";

class App extends Component<{}, AppState> {
  state: AppState = {
    break: 300,
    session: 1500,
    timer: 1500,
    isPulseAcive: { first: false, second: false },
    activeInterval: Interval.Session,
    isTimerActive: false,
  };
  private pulse1 = createRef<HTMLDivElement>();
  private pulse2 = createRef<HTMLDivElement>();
  private audio = new Audio(alert);
  private decrementTimerIntervalId: ReturnType<typeof setTimeout> | undefined;
  private firstPulseTimeoutId: ReturnType<typeof setTimeout> | undefined;
  private secondPulseTimeoutId: ReturnType<typeof setTimeout> | undefined;

  componentWillUnmount() {
    clearInterval(this.decrementTimerIntervalId);
    clearTimeout(this.firstPulseTimeoutId);
    clearTimeout(this.secondPulseTimeoutId);
  }

  decrementTimer = () => {
    if (this.state.timer === 4) {
      this.audio.play();
    }

    this.setState((state) => ({
      ...state,
      timer: state.timer
        ? state.timer - 1
        : state[this.toggleInterval(state.activeInterval)],
      activeInterval: state.timer
        ? state.activeInterval
        : this.toggleInterval(state.activeInterval),
    }));
  };

  startTimer = () => {
    this.setState(
      (state) => ({
        ...state,
        isTimerActive: true,
        isPulseAcive: { first: false, second: false },
      }),
      () => {
        this.pulse1.current!.removeEventListener(
          "animationiteration",
          this.stopFirstPulse
        );

        this.pulse2.current!.removeEventListener(
          "animationiteration",
          this.stopSecondPulse
        );

        if (this.state.timer <= 3) {
          this.audio.currentTime = 3 - this.state.timer;
          this.audio.play();
        }
      }
    );

    this.decrementTimerIntervalId = setInterval(this.decrementTimer, 1000);
    this.firstPulseTimeoutId = setTimeout(this.startFirstPulse, 1000);
    this.secondPulseTimeoutId = setTimeout(this.startSecondPulse, 2000);
  };

  pauseTimer = () => {
    clearInterval(this.decrementTimerIntervalId);
    clearTimeout(this.firstPulseTimeoutId);
    clearTimeout(this.secondPulseTimeoutId);

    if (this.state.timer <= 3) {
      this.audio.pause();
    }

    this.setState(
      (state) => ({
        ...state,
        isTimerActive: false,
      }),
      () => {
        this.pulse1.current!.addEventListener(
          "animationiteration",
          this.stopFirstPulse,
          { once: true }
        );

        this.pulse2.current!.addEventListener(
          "animationiteration",
          this.stopSecondPulse,
          { once: true }
        );
      }
    );
  };

  stopTimer = () => {
    clearInterval(this.decrementTimerIntervalId);
    clearTimeout(this.firstPulseTimeoutId);
    clearTimeout(this.secondPulseTimeoutId);

    if (this.state.timer <= 3) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.setState(
      (state) => ({
        ...state,
        break: 300,
        session: 1500,
        timer: 1500,
        activeInterval: Interval.Session,
        isTimerActive: false,
      }),
      () => {
        this.pulse1.current!.addEventListener(
          "animationiteration",
          this.stopFirstPulse,
          { once: true }
        );

        this.pulse2.current!.addEventListener(
          "animationiteration",
          this.stopSecondPulse,
          { once: true }
        );
      }
    );
  };

  incrementInterval = (interval: Interval) => {
    this.setState((state) => ({
      ...state,
      [interval]: state[interval] === 3600 ? 60 : state[interval] + 60,
      timer:
        this.state.activeInterval === interval
          ? state[interval] === 3600
            ? 60
            : state[interval] + 60
          : state.timer,
    }));
  };

  decrementInterval = (interval: Interval) => {
    this.setState((state) => ({
      ...state,
      [interval]: state[interval] === 60 ? 3600 : state[interval] - 60,
      timer:
        this.state.activeInterval === interval
          ? state[interval] === 60
            ? 3600
            : state[interval] - 60
          : state.timer,
    }));
  };

  startFirstPulse = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: { ...state.isPulseAcive, first: true },
    }));
  };

  stopFirstPulse = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: {
        ...state.isPulseAcive,
        first: false,
      },
    }));
  };

  startSecondPulse = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: { ...state.isPulseAcive, second: true },
    }));
  };

  stopSecondPulse = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: {
        ...state.isPulseAcive,
        second: false,
      },
    }));
  };

  toggleInterval = (activeInterval: IntervalType) => {
    return activeInterval === Interval.Session
      ? Interval.Break
      : Interval.Session;
  };

  formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2);
  };

  formatInterval = (seconds: number) => {
    return Math.floor(seconds / 60) + " min";
  };

  render() {
    const pulse1 = classNames({
      timer__pulse: true,
      "timer__pulse--active": this.state.isPulseAcive.first,
      "timer__pulse--secondary": this.state.timer <= 3,
    });

    const pulse2 = classNames({
      timer__pulse: true,
      "timer__pulse--active": this.state.isPulseAcive.second,
      "timer__pulse--secondary": this.state.timer <= 3,
    });

    return (
      <div className="app">
        <div className="sizer">
          <div className="timer">
            <span className={pulse1} ref={this.pulse1}></span>
            <span className={pulse2} ref={this.pulse2}></span>
            <Lettering
              as="h2"
              angleSpan={7.5}
              angleOffset={-65}
              radius={65}
              active={this.state.activeInterval === Interval.Break}
              buttons={!this.state.isTimerActive}
              intervalType={Interval.Break}
              incrementInterval={this.incrementInterval}
              decrementInterval={this.decrementInterval}
            >
              Break
            </Lettering>
            <Lettering
              as="h3"
              angleSpan={5}
              angleOffset={-57}
              radius={0}
              active={this.state.activeInterval === Interval.Break}
              buttons={false}
              small
            >
              {this.formatInterval(this.state.break)}
            </Lettering>
            <Lettering
              as="h2"
              angleSpan={7.5}
              angleOffset={15}
              radius={65}
              active={this.state.activeInterval === Interval.Session}
              buttons={!this.state.isTimerActive}
              intervalType={Interval.Session}
              incrementInterval={this.incrementInterval}
              decrementInterval={this.decrementInterval}
            >
              Session
            </Lettering>
            <Lettering
              as="h3"
              angleSpan={5}
              angleOffset={27}
              radius={0}
              active={this.state.activeInterval === Interval.Session}
              buttons={false}
              small
            >
              {this.formatInterval(this.state.session)}
            </Lettering>
            <div className="timer__content">
              <div className="timer__content-time">
                {this.formatTimer(this.state.timer)}
              </div>
              <div className="timer__content-controls">
                <button
                  disabled={this.state.isTimerActive}
                  className="timer__content-controls-button"
                  onClick={this.startTimer}
                  aria-label="start"
                >
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="timer__content-controls-button-icon"
                  />
                </button>
                <button
                  disabled={!this.state.isTimerActive}
                  className="timer__content-controls-button"
                  onClick={this.pauseTimer}
                  aria-label="pause"
                >
                  <FontAwesomeIcon
                    icon={faPause}
                    className="timer__content-controls-button-icon"
                  />
                </button>
                <button
                  className="timer__content-controls-button"
                  onClick={this.stopTimer}
                  aria-label="stop"
                >
                  <FontAwesomeIcon
                    icon={faStop}
                    className="timer__content-controls-button-icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
