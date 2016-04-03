using UnityEngine;
using System.Collections;

public class CameraMovement : MonoBehaviour {

    public float speed;
    public float h;
    public float v;
    
    public void FixedUpdate() {

        // Store the input axes.
        /*float */h = Input.GetAxis("Horizontal");
        /*float */v = Input.GetAxis("Vertical");

        // Move the player around the scene.
        Move (h, v);
    }

    void Move (float h, float v)
    {
        //// Set the movement vector based on the axis input.
        //Vector3 movement = new Vector3(h, 0f, v);
        
        //// Normalise the movement vector and make it proportional to the speed per second.
        //movement = movement.normalized * speed * Time.deltaTime;
    
        //// Move the player to it's current position plus the movement.
        //transform.position = transform.position + movement;
        
        transform.position = transform.position + speed * v * transform.forward;
        transform.position = transform.position + speed * h * transform.right;
    }
}
