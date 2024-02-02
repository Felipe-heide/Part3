const Notification = ({ message }) => {
    if (!message || !message[0]) {
      return null; 
    }
  
    const [type, content] = message;
  
    const successStyles = {
      color: 'green',
      background: 'lightgreen',
      padding: '10px',
      border: '1px solid darkgreen',
      borderRadius: '5px',
    };
  
    const errorStyles = {
      color: 'white',
      background: 'red',
      padding: '10px',
      border: '1px solid darkred',
      borderRadius: '5px',
    };
  
    const styles = type === 'success' ? successStyles : errorStyles;
  
    return (
      <div style={styles}>
        <p>{content}</p>
      </div>
    );
  };
  
  export default Notification;
  