import { createRef, Component } from "react";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./Lettering.scss";

class Lettering extends Component {
  constructor(props) {
    super(props);
    this.angleSpan = this.props.angleSpan || 45;
    this.angleOffset = this.props.angleOffset || 0;
    this.anglePerChar = this.angleSpan / 6;
    this.height = this.props.radius;
    this.decrementNodeRef = createRef();
    this.incrementNodeRef = createRef();
  }

  state = { items: ["1", "2", "3"] };

  incrementInterval = () => {
    this.props.incrementInterval(this.props.intervalType);
  };

  decrementInterval = () => {
    this.props.decrementInterval(this.props.intervalType);
  };

  addItem = () => {
    this.setState((state) => ({
      ...state,
      items: [...state.items, "X"],
    }));
  };

  render() {
    const CustomTag = this.props.tag;

    const rotatePlusChar =
      this.angleOffset + this.anglePerChar * (this.props.children.length + 1);

    const lettering = classNames({
      lettering: true,
      "lettering--active": this.props.active,
      "lettering--small": this.props.small,
    });

    return (
      <div className={lettering}>
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
              transform: `translateX(-50%) rotate(${this.angleOffset}deg)`,
              height: `calc(50% + ${this.height}px`,
            }}
          >
            <button
              className="lettering__controls-button"
              onClick={this.decrementInterval}
              aria-label="Minus"
            >
              <FontAwesomeIcon
                icon={faMinus}
                className="lettering__controls-button-icon"
              />
            </button>
          </div>
        </CSSTransition>
        <CustomTag className="lettering__string">
          {this.props.children.split("").map((char, index) => {
            const rotateLetter =
              this.angleOffset + this.anglePerChar * (index + 1);
            return (
              <span
                key={index}
                className="lettering__string-char"
                style={{
                  transform: `translateX(-50%) rotate(${rotateLetter}deg)`,
                  height: `calc(50% + ${this.height}px`,
                }}
              >
                {char}
              </span>
            );
          })}
        </CustomTag>
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
              transform: `translateX(-50%) rotate(${rotatePlusChar}deg)`,
              height: `calc(50% + ${this.height}px`,
            }}
          >
            <button
              className="lettering__controls-button"
              onClick={this.incrementInterval}
              aria-label="Plus"
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
