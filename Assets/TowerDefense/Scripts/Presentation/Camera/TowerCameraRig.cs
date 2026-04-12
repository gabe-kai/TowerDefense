using UnityEngine;

#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace TowerDefense.Presentation.Camera
{
    public sealed class TowerCameraRig : MonoBehaviour
    {
        [Header("Scene References")]
        [SerializeField] private Transform anchor;
        [SerializeField] private UnityEngine.Camera controlledCamera;

        [Header("Framing")]
        [SerializeField] private float yawDegrees;
        [SerializeField] private float pitchDegrees = 35f;
        [SerializeField] private float distance = 18f;
        [SerializeField] private float heightOffset = 2f;
        [SerializeField] private Vector2 orbitOffset;

        [Header("Limits")]
        [SerializeField] private Vector2 pitchLimits = new Vector2(15f, 70f);
        [SerializeField] private Vector2 distanceLimits = new Vector2(8f, 32f);
        [SerializeField] private float maxOrbitRadius = 3f;

        [Header("Input Sensitivity")]
        [SerializeField] private float yawSensitivity = 120f;
        [SerializeField] private float pitchSensitivity = 80f;
        [SerializeField] private float zoomSensitivity = 4f;
        [SerializeField] private float orbitSensitivity = 5f;
        [SerializeField] private float recenterSpeed = 8f;

        private void Reset()
        {
            controlledCamera = GetComponentInChildren<UnityEngine.Camera>();
        }

        private void Awake()
        {
            if (controlledCamera == null)
            {
                controlledCamera = GetComponentInChildren<UnityEngine.Camera>();
            }
        }

        private void LateUpdate()
        {
            if (anchor == null || controlledCamera == null)
            {
                return;
            }

            ReadInput(Time.deltaTime);
            ApplyCameraTransform();
        }

        private void ReadInput(float deltaTime)
        {
#if ENABLE_INPUT_SYSTEM
            var keyboard = Keyboard.current;
            var mouse = Mouse.current;

            if (keyboard == null && mouse == null)
            {
                return;
            }

            var orbitInput = Vector2.zero;
            if (keyboard != null)
            {
                if (keyboard.qKey.isPressed)
                {
                    yawDegrees -= yawSensitivity * deltaTime;
                }

                if (keyboard.eKey.isPressed)
                {
                    yawDegrees += yawSensitivity * deltaTime;
                }

                if (keyboard.upArrowKey.isPressed)
                {
                    pitchDegrees -= pitchSensitivity * deltaTime;
                }

                if (keyboard.downArrowKey.isPressed)
                {
                    pitchDegrees += pitchSensitivity * deltaTime;
                }

                if (keyboard.aKey.isPressed)
                {
                    orbitInput.x -= 1f;
                }

                if (keyboard.dKey.isPressed)
                {
                    orbitInput.x += 1f;
                }

                if (keyboard.wKey.isPressed)
                {
                    orbitInput.y += 1f;
                }

                if (keyboard.sKey.isPressed)
                {
                    orbitInput.y -= 1f;
                }

                if (keyboard.spaceKey.wasPressedThisFrame)
                {
                    orbitOffset = Vector2.zero;
                }

                if (keyboard.nKey.wasPressedThisFrame)
                {
                    yawDegrees = 0f;
                }
            }

            if (mouse != null)
            {
                if (mouse.rightButton.isPressed)
                {
                    var delta = mouse.delta.ReadValue();
                    yawDegrees += delta.x * yawSensitivity * 0.01f;
                    pitchDegrees -= delta.y * pitchSensitivity * 0.01f;
                }

                var scroll = mouse.scroll.ReadValue().y;
                if (!Mathf.Approximately(scroll, 0f))
                {
                    distance -= scroll * zoomSensitivity * 0.01f;
                }
            }

            if (orbitInput.sqrMagnitude > 0f)
            {
                orbitInput = Vector2.ClampMagnitude(orbitInput, 1f);
                orbitOffset += orbitInput * orbitSensitivity * deltaTime;
            }
            else
            {
                orbitOffset = Vector2.Lerp(orbitOffset, Vector2.zero, recenterSpeed * deltaTime);
            }

#endif
        }

        private void ApplyCameraTransform()
        {
            pitchDegrees = Mathf.Clamp(pitchDegrees, pitchLimits.x, pitchLimits.y);
            distance = Mathf.Clamp(distance, distanceLimits.x, distanceLimits.y);
            orbitOffset = Vector2.ClampMagnitude(orbitOffset, maxOrbitRadius);

            var yaw = Quaternion.Euler(0f, yawDegrees, 0f);
            var pitch = Quaternion.Euler(pitchDegrees, 0f, 0f);
            var anchorPosition = anchor.position + Vector3.up * heightOffset;
            var orbit = yaw * new Vector3(orbitOffset.x, 0f, orbitOffset.y);
            var cameraRotation = yaw * pitch;

            controlledCamera.transform.SetPositionAndRotation(
                anchorPosition + orbit + cameraRotation * new Vector3(0f, 0f, -distance),
                cameraRotation);
        }
    }
}
