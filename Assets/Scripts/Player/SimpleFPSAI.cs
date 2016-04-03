using UnityEngine;
using System.Collections;

namespace CompleteProject {
	public class SimpleFPSAI : MonoBehaviour {

		public GameObject hero;
		Transform player;
		PlayerHealth playerHealth;      // Reference to the player's health.
		NavMeshAgent nav;               // Reference to the nav mesh agent.

		// Use this for initialization
		void Start() {
			hero = GameObject.FindGameObjectWithTag("Hero");
			player = GameObject.FindGameObjectWithTag("Player").transform;
			playerHealth = player.GetComponent<PlayerHealth>();
			nav = GetComponent<NavMeshAgent>();
		}

		// Update is called once per frame
		void Update() {
			if (playerHealth.currentHealth > 0) {
				Vector3 dir = hero.transform.position - playerHealth.nearestEnemy.transform.position;
				dir = dir.normalized * 2;
				nav.SetDestination(hero.transform.position - dir);

				
			} else {
				nav.enabled = false;
			}
		}
	}

}