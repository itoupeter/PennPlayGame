using UnityEngine;
using System.Collections;

public class MoveByWASD : MonoBehaviour {

    public float speed;
    
    public void FixedUpdate() {
        transform.position = transform.position + speed * Input.GetAxis( "Vertical" ) * transform.forward;
        transform.position = transform.position + speed * Input.GetAxis("Horizontal") * transform.right;
        //transform.rotation = transform.rotation * Quaternion.Euler( 0, 60 * speed * Input.GetAxis( "Horizontal" ), 0 );
    }
}
