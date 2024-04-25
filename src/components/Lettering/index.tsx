import React, { createRef, Component } from "react";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./Lettering.scss";
import { IntervalType } from "../../App.types";

interface LetteringProps {
  intervalType?: IntervalType;
  as: keyof React.JSX.IntrinsicElements;
  active: boolean;
  small?: boolean;
  buttons: boolean;
  angleOffset: number;
  angleSpan: number;
  radius: number;
  children: string;
  incrementInterval?: (intervalType: IntervalType) => void;
  decrementInterval?: (intervalType: IntervalType) => void;
}

class Lettering extends Component<LetteringProps> {
  private decrementNodeRef = createRef<HTMLDivElement>();
  private incrementNodeRef = createRef<HTMLDivElement>();

  handleIncrementInterval = () => {
    if (this.props.incrementInterval && this.props.intervalType) {
      this.props.incrementInterval(this.props.intervalType);
    }
  };

  handleDecrementInterval = () => {
    if (this.props.decrementInterval && this.props.intervalType) {
      this.props.decrementInterval(this.props.intervalType);
    }
  };

  render() {
    const Tag = this.props.as;

    const lettering = classNames({
      lettering: true,
      "lettering--active": this.props.active,
      "lettering--small": this.props.small,
    });

    return (
      <div className={lettering} data-testid={this.props.intervalType}>
        <CSSTransition
          nodeRef={this.decrementNodeRef}
          in={this.props.buttons}
          appear={false}
          enter={true}
          exit={true}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div
            ref={this.decrementNodeRef}
            className="lettering__controls"
            style={{
              transform: `translateX(-50%) rotate(${this.props.angleOffset}deg)`,
              height: `calc(50% + ${this.props.radius}px`,
            }}
          >
            <button
              data-testid="decrement"
              className="lettering__controls-button"
              onClick={this.handleDecrementInterval}
              aria-label="decrement"
            >
              <FontAwesomeIcon
                icon={faMinus}
                className="lettering__controls-button-icon"
              />
            </button>
          </div>
        </CSSTransition>
        <Tag className="lettering__string">
          {this.props.children.split("").map((char, index) => (
            <span
              key={index}
              className="lettering__string-char"
              style={{
                transform: `translateX(-50%) rotate(${
                  this.props.angleOffset + this.props.angleSpan * (index + 1)
                }deg)`,
                height: `calc(50% + ${this.props.radius}px`,
              }}
            >
              {char}
            </span>
          ))}
        </Tag>
        <CSSTransition
          nodeRef={this.incrementNodeRef}
          in={this.props.buttons}
          appear={false}
          enter={true}
          exit={true}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div
            ref={this.incrementNodeRef}
            className="lettering__controls"
            style={{
              transform: `translateX(-50%) rotate(${
                this.props.angleOffset +
                this.props.angleSpan * (this.props.children.length + 1)
              }deg)`,
              height: `calc(50% + ${this.props.radius}px`,
            }}
          >
            <button
              data-testid="increment"
              className="lettering__controls-button"
              onClick={this.handleIncrementInterval}
              aria-label="increment"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="lettering__controls-button-icon"
              />
            </button>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default Lettering;
