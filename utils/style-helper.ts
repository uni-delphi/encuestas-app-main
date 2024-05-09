interface IComponentProps {
    color: string;
    text: string;
    buttonText: string;
}

let completed: number = 8;
let empty: number = 0;

export const levelOfCompletion = (responses: any) => {
  let props: IComponentProps = {
    color: "",
    text: "",
    buttonText: "",
  };

  if (responses === completed) {
    props.color = "bg-[#CCE8D4]";
    props.text = "Completa";
    props.buttonText = "Editar";
  } else if (responses === empty) {
    props.color = "bg-[#EAEAEA]";
    props.text = "Por Empezar";
    props.buttonText = "Responder";
  } else {
    props.color = "bg-[#FFFFBF]";
    props.text = "Casi Listo";
    props.buttonText = "Ampliar";
  }
  return props;
};
