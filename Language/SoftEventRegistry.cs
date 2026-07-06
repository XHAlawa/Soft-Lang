namespace Soft.Compiler.Language;

/// <summary>
/// Single source of truth for all DOM events and event modifiers.
/// Every parser, analyzer, compiler, emitter, and runtime must use this registry.
/// No hardcoded event strings allowed anywhere in the codebase.
/// </summary>
public static class SoftEventRegistry
{
    #region Event Categories
    
    /// <summary>
    /// Mouse events
    /// </summary>
    public static readonly string[] MouseEvents = new[]
    {
        "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout",
        "mouseenter", "mouseleave", "contextmenu"
    };
    
    /// <summary>
    /// Pointer events (modern replacement for mouse/touch)
    /// </summary>
    public static readonly string[] PointerEvents = new[]
    {
        "pointerdown", "pointerup", "pointermove", "pointercancel", "pointerover", "pointerout",
        "pointerenter", "pointerleave", "gotpointercapture", "lostpointercapture"
    };
    
    /// <summary>
    /// Keyboard events
    /// </summary>
    public static readonly string[] KeyboardEvents = new[]
    {
        "keydown", "keyup", "keypress"
    };
    
    /// <summary>
    /// Focus events
    /// </summary>
    public static readonly string[] FocusEvents = new[]
    {
        "focus", "blur", "focusin", "focusout"
    };
    
    /// <summary>
    /// Form events
    /// </summary>
    public static readonly string[] FormEvents = new[]
    {
        "submit", "reset", "change", "input"
    };
    
    /// <summary>
    /// Clipboard events
    /// </summary>
    public static readonly string[] ClipboardEvents = new[]
    {
        "copy", "cut", "paste"
    };
    
    /// <summary>
    /// Wheel events
    /// </summary>
    public static readonly string[] WheelEvents = new[]
    {
        "wheel"
    };
    
    /// <summary>
    /// Touch events
    /// </summary>
    public static readonly string[] TouchEvents = new[]
    {
        "touchstart", "touchend", "touchmove", "touchcancel"
    };
    
    /// <summary>
    /// Drag and Drop events
    /// </summary>
    public static readonly string[] DragDropEvents = new[]
    {
        "drag", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "drop"
    };
    
    /// <summary>
    /// Animation events
    /// </summary>
    public static readonly string[] AnimationEvents = new[]
    {
        "animationstart", "animationend", "animationiteration"
    };
    
    /// <summary>
    /// Transition events
    /// </summary>
    public static readonly string[] TransitionEvents = new[]
    {
        "transitionstart", "transitionend", "transitioncancel", "transitionrun"
    };
    
    /// <summary>
    /// Media events
    /// </summary>
    public static readonly string[] MediaEvents = new[]
    {
        "abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended",
        "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing",
        "progress", "ratechange", "seeked", "seeking", "stalled", "suspend", "timeupdate",
        "volumechange", "waiting"
    };
    
    /// <summary>
    /// Window events
    /// </summary>
    public static readonly string[] WindowEvents = new[]
    {
        "resize", "scroll", "load", "beforeunload", "unload", "hashchange", "popstate"
    };
    
    /// <summary>
    /// History events
    /// </summary>
    public static readonly string[] HistoryEvents = new[]
    {
        "popstate"
    };
    
    /// <summary>
    /// Navigation events
    /// </summary>
    public static readonly string[] NavigationEvents = new[]
    {
        "navigate"
    };
    
    /// <summary>
    /// Document events
    /// </summary>
    public static readonly string[] DocumentEvents = new[]
    {
        "readystatechange", "DOMContentLoaded", "beforeprint", "afterprint"
    };
    
    /// <summary>
    /// Selection events
    /// </summary>
    public static readonly string[] SelectionEvents = new[]
    {
        "selectstart", "selectionchange"
    };
    
    /// <summary>
    /// Composition events (IME input)
    /// </summary>
    public static readonly string[] CompositionEvents = new[]
    {
        "compositionstart", "compositionupdate", "compositionend"
    };
    
    /// <summary>
    /// Input events
    /// </summary>
    public static readonly string[] InputEvents = new[]
    {
        "beforeinput", "input"
    };
    
    /// <summary>
    /// Image events
    /// </summary>
    public static readonly string[] ImageEvents = new[]
    {
        "load", "error"
    };
    
    /// <summary>
    /// Error events
    /// </summary>
    public static readonly string[] ErrorEvents = new[]
    {
        "error"
    };
    
    /// <summary>
    /// Progress events
    /// </summary>
    public static readonly string[] ProgressEvents = new[]
    {
        "loadstart", "progress", "load", "abort", "error", "loadend"
    };
    
    #endregion
    
    #region All Events
    
    /// <summary>
    /// All supported DOM events combined
    /// </summary>
    public static readonly string[] AllEvents = MouseEvents
        .Concat(PointerEvents)
        .Concat(KeyboardEvents)
        .Concat(FocusEvents)
        .Concat(FormEvents)
        .Concat(ClipboardEvents)
        .Concat(WheelEvents)
        .Concat(TouchEvents)
        .Concat(DragDropEvents)
        .Concat(AnimationEvents)
        .Concat(TransitionEvents)
        .Concat(MediaEvents)
        .Concat(WindowEvents)
        .Concat(HistoryEvents)
        .Concat(NavigationEvents)
        .Concat(DocumentEvents)
        .Concat(SelectionEvents)
        .Concat(CompositionEvents)
        .Concat(InputEvents)
        .Concat(ImageEvents)
        .Concat(ErrorEvents)
        .Concat(ProgressEvents)
        .Distinct()
        .ToArray();
    
    #endregion
    
    #region Event Modifiers
    
    /// <summary>
    /// Event modifier: stops event propagation
    /// </summary>
    public const string ModifierStop = "stop";
    
    /// <summary>
    /// Event modifier: prevents default behavior
    /// </summary>
    public const string ModifierPrevent = "prevent";
    
    /// <summary>
    /// Event modifier: use capture phase
    /// </summary>
    public const string ModifierCapture = "capture";
    
    /// <summary>
    /// Event modifier: trigger handler only once
    /// </summary>
    public const string ModifierOnce = "once";
    
    /// <summary>
    /// Event modifier: passive event listener
    /// </summary>
    public const string ModifierPassive = "passive";
    
    /// <summary>
    /// Event modifier: only trigger if event.target is the element itself
    /// </summary>
    public const string ModifierSelf = "self";
    
    #endregion
    
    #region Key Modifiers
    
    /// <summary>
    /// Key modifiers for keyboard events
    /// </summary>
    public static readonly string[] KeyModifiers = new[]
    {
        "enter", "tab", "esc", "escape", "space", "up", "down", "left", "right",
        "delete", "backspace", "insert", "home", "end", "pageup", "pagedown"
    };
    
    /// <summary>
    /// System key modifiers
    /// </summary>
    public static readonly string[] SystemKeyModifiers = new[]
    {
        "ctrl", "shift", "alt", "meta", "exact"
    };
    
    #endregion
    
    #region All Modifiers
    
    /// <summary>
    /// All event modifiers combined
    /// </summary>
    public static readonly string[] AllModifiers = new[]
    {
        ModifierStop, ModifierPrevent, ModifierCapture, ModifierOnce, ModifierPassive, ModifierSelf
    };
    
    /// <summary>
    /// All keyboard key modifiers
    /// </summary>
    public static readonly string[] AllKeyModifiers = KeyModifiers.Concat(SystemKeyModifiers).ToArray();
    
    #endregion
    
    #region Validation Methods
    
    /// <summary>
    /// Check if an event name is a valid DOM event
    /// </summary>
    public static bool IsValidEvent(string eventName)
    {
        if (string.IsNullOrWhiteSpace(eventName))
            return false;
        
        var normalized = eventName.ToLowerInvariant();
        return AllEvents.Contains(normalized);
    }
    
    /// <summary>
    /// Check if a modifier is valid
    /// </summary>
    public static bool IsValidModifier(string modifier)
    {
        if (string.IsNullOrWhiteSpace(modifier))
            return false;
        
        var normalized = modifier.ToLowerInvariant();
        return AllModifiers.Contains(normalized) || AllKeyModifiers.Contains(normalized);
    }
    
    /// <summary>
    /// Check if a modifier is a DOM event modifier (not a key modifier)
    /// </summary>
    public static bool IsDomEventModifier(string modifier)
    {
        if (string.IsNullOrWhiteSpace(modifier))
            return false;
        
        var normalized = modifier.ToLowerInvariant();
        return AllModifiers.Contains(normalized);
    }
    
    /// <summary>
    /// Check if a modifier is a key modifier
    /// </summary>
    public static bool IsKeyModifier(string modifier)
    {
        if (string.IsNullOrWhiteSpace(modifier))
            return false;
        
        var normalized = modifier.ToLowerInvariant();
        return AllKeyModifiers.Contains(normalized);
    }
    
    /// <summary>
    /// Check if a modifier combination is valid
    /// Some modifiers conflict with each other
    /// </summary>
    public static bool IsValidModifierCombination(List<string> modifiers)
    {
        if (modifiers == null || modifiers.Count == 0)
            return true;
        
        var uniqueModifiers = modifiers.Select(m => m.ToLowerInvariant()).Distinct().ToList();
        
        // Check for duplicate modifiers
        if (uniqueModifiers.Count != modifiers.Count)
            return false;
        
        // Check for conflicting modifiers
        var hasPassive = uniqueModifiers.Contains(ModifierPassive);
        var hasPrevent = uniqueModifiers.Contains(ModifierPrevent);
        
        // passive and prevent are incompatible
        if (hasPassive && hasPrevent)
            return false;
        
        return true;
    }
    
    /// <summary>
    /// Get the category of an event
    /// </summary>
    public static string? GetEventCategory(string eventName)
    {
        if (string.IsNullOrWhiteSpace(eventName))
            return null;
        
        var normalized = eventName.ToLowerInvariant();
        
        if (MouseEvents.Contains(normalized)) return "Mouse";
        if (PointerEvents.Contains(normalized)) return "Pointer";
        if (KeyboardEvents.Contains(normalized)) return "Keyboard";
        if (FocusEvents.Contains(normalized)) return "Focus";
        if (FormEvents.Contains(normalized)) return "Form";
        if (ClipboardEvents.Contains(normalized)) return "Clipboard";
        if (WheelEvents.Contains(normalized)) return "Wheel";
        if (TouchEvents.Contains(normalized)) return "Touch";
        if (DragDropEvents.Contains(normalized)) return "DragDrop";
        if (AnimationEvents.Contains(normalized)) return "Animation";
        if (TransitionEvents.Contains(normalized)) return "Transition";
        if (MediaEvents.Contains(normalized)) return "Media";
        if (WindowEvents.Contains(normalized)) return "Window";
        if (HistoryEvents.Contains(normalized)) return "History";
        if (NavigationEvents.Contains(normalized)) return "Navigation";
        if (DocumentEvents.Contains(normalized)) return "Document";
        if (SelectionEvents.Contains(normalized)) return "Selection";
        if (CompositionEvents.Contains(normalized)) return "Composition";
        if (InputEvents.Contains(normalized)) return "Input";
        if (ImageEvents.Contains(normalized)) return "Image";
        if (ErrorEvents.Contains(normalized)) return "Error";
        if (ProgressEvents.Contains(normalized)) return "Progress";
        
        return null;
    }
    
    /// <summary>
    /// Check if an event is compatible with a modifier
    /// </summary>
    public static bool IsEventCompatibleWithModifier(string eventName, string modifier)
    {
        if (!IsValidEvent(eventName) || !IsValidModifier(modifier))
            return false;
        
        var normalizedModifier = modifier.ToLowerInvariant();
        
        // Key modifiers only work with keyboard events
        if (IsKeyModifier(normalizedModifier))
        {
            var category = GetEventCategory(eventName);
            return category == "Keyboard";
        }
        
        return true;
    }
    
    #endregion
    
    #region Event Name Normalization
    
    /// <summary>
    /// Normalize event name to standard form
    /// Handles: onclick -> click, onClick -> click, CLICK -> click
    /// </summary>
    public static string NormalizeEventName(string eventName)
    {
        if (string.IsNullOrWhiteSpace(eventName))
            return eventName;
        
        var normalized = eventName.ToLowerInvariant();
        
        // Remove 'on' prefix if present
        if (normalized.StartsWith("on"))
        {
            normalized = normalized.Substring(2);
        }
        
        return normalized;
    }
    
    #endregion
    
    #region Directive Generation
    
    /// <summary>
    /// Generate the @ directive for an event
    /// </summary>
    public static string ToDirective(string eventName)
    {
        var normalized = NormalizeEventName(eventName);
        return $"@{normalized}";
    }
    
    #endregion
}
